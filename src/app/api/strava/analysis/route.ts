import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('activityId');

    if (!activityId) {
        return NextResponse.json({ error: 'Missing activityId' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('strava_access_token')?.value || process.env.STRAVA_ACCESS_TOKEN_FALLBACK;

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch streams: time, heartrate, watts (or velocity_smooth for runs)
        // We request 'watts' and 'velocity_smooth' to handle both rides and runs.
        const response = await axios.get(`https://www.strava.com/api/v3/activities/${activityId}/streams`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                keys: 'time,heartrate,watts,velocity_smooth',
                key_by_type: true
            }
        });

        const streams = response.data;

        // Validation: We need at least Heart Rate and Time
        if (!streams.heartrate || !streams.time) {
            return NextResponse.json({ error: 'Missing heart rate data for analysis' }, { status: 400 });
        }

        const timeData = streams.time.data;
        const hrData = streams.heartrate.data;
        const powerData = streams.watts?.data;
        const velocityData = streams.velocity_smooth?.data;

        // Determine metric to compare against (Power preferred, then Speed)
        let workData = powerData;
        let workLabel = 'Power';

        if (!workData && velocityData) {
            workData = velocityData;
            workLabel = 'Speed';
        }

        if (!workData) {
            return NextResponse.json({ error: 'Missing power or speed data for analysis' }, { status: 400 });
        }

        // --- Calculation Logic ---

        // 1. Filter valid data points (exclude zeros/stops if needed, but streams usually align)
        // For simplicity and robustness, we use the raw aligned streams.

        // 1. Identify Time Boundaries (Exclude Warm-up & Cool-down)
        const totalPoints = timeData.length;
        const totalDuration = timeData[timeData.length - 1];
        const startOffset = 600; // 10 minutes Warm-up
        const endOffset = 300;   // 5 minutes Cool-down

        // If activity is too short to have meaningful data left after trimming
        // Need at least 10 mins (600s) of "main set" data
        if (totalDuration < (startOffset + endOffset + 600)) {
            return NextResponse.json({ error: 'Activity too short for valid drift analysis (needs > 20 mins)' }, { status: 400 });
        }

        // Find Start Index
        let startIndex = 0;
        for (let i = 0; i < totalPoints; i++) {
            if (timeData[i] >= startOffset) {
                startIndex = i;
                break;
            }
        }

        // Find End Index
        let endIndex = totalPoints;
        const cutoffTime = totalDuration - endOffset;
        for (let i = totalPoints - 1; i >= 0; i--) {
            if (timeData[i] <= cutoffTime) {
                endIndex = i + 1; // Exclusive end index
                break;
            }
        }

        // 2. Split Trimmed Data into Halves
        const trimmedCount = endIndex - startIndex;
        const midpoint = startIndex + Math.floor(trimmedCount / 2);

        // Helper to calculate average of a slice
        const calculateAvg = (data: number[], start: number, end: number) => {
            let sum = 0;
            let count = 0;
            for (let i = start; i < end; i++) {
                // Filter out zeros for work data to calculate meaningful "Efficiency"
                sum += data[i];
                count++;
            }
            return count > 0 ? sum / count : 0;
        };

        const avgHr1 = calculateAvg(hrData, startIndex, midpoint);
        const avgWork1 = calculateAvg(workData, startIndex, midpoint);

        const avgHr2 = calculateAvg(hrData, midpoint, endIndex);
        const avgWork2 = calculateAvg(workData, midpoint, endIndex);

        // 3. Calculate Efficiency Factor (EF)
        const ef1 = avgWork1 / avgHr1;
        const ef2 = avgWork2 / avgHr2;

        // 4. Calculate Decoupling (Drift)
        const decoupling = ((ef1 - ef2) / ef1) * 100;

        let interpretation = '';
        if (decoupling < 3) interpretation = 'Excellent aerobic endurance.';
        else if (decoupling < 5) interpretation = 'Good stability, clear metabolic fitness.';
        else interpretation = 'Significant drift. Sign of fatigue, dehydration, or undeveloped aerobic base.';

        return NextResponse.json({
            drift: parseFloat(decoupling.toFixed(2)),
            ef1: parseFloat(ef1.toFixed(2)),
            ef2: parseFloat(ef2.toFixed(2)),
            interpretation,
            metricUsed: workLabel,
            analysisRange: {
                start: Math.round(timeData[startIndex] / 60),
                end: Math.round(timeData[endIndex - 1] / 60)
            }
        });

    } catch (error: any) {
        console.error('Analysis failed:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to analyze activity' }, { status: 500 });
    }
}
