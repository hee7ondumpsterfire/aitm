
interface PlanParams {
    type?: 'polarized' | 'pyramidal';
    feeling?: 'sad' | 'normal' | 'happy' | null;
    targetTSS?: number;
    hours?: number; // From questionnaire
}

export function generateFallbackPlan(params: PlanParams): string {
    const { type = 'pyramidal', feeling = 'normal', targetTSS = 300, hours = 5 } = params;

    // 1. Calculate Scaling Factor based on feeling
    let scale = 1.0;
    if (feeling === 'sad') scale = 0.6; // Reduce volume/intensity significantly
    if (feeling === 'happy') scale = 1.1; // Slight increase

    // 2. Determine Dates
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon
    const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diffToMonday);

    const getDayStr = (offset: number) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + offset);
        return d.toLocaleDateString('en-US', { weekday: 'long' });
    };

    // 3. Define Templates
    // Simple logic: Base duration * scale. 
    // Format: [Activity Name, Duration (approx), Description]

    let plan = [];

    if (type === 'polarized') {
        const hitDuration = Math.round(60 * scale);
        const litDuration = Math.round(60 * (hours / 5) * scale); // Scale roughly by available hours
        const longDuration = Math.round(120 * (hours / 5) * scale);

        plan = [
            { day: getDayStr(0), name: "Rest Day", duration: "0 min", desc: "Total rest. Focus on sleep and hydration." },
            { day: getDayStr(1), name: "HIT: 4x8min", duration: `${hitDuration} min`, desc: "**High Intensity**. Warm up, then 4x8min at Threshold (Zone 4) with 2min rest. Cool down." },
            { day: getDayStr(2), name: "LIT: Recovery", duration: "45 min", desc: "**Low Intensity**. strictly Zone 1. Easy spin." },
            { day: getDayStr(3), name: "LIT: Aerobic", duration: `${litDuration} min`, desc: "**Low Intensity**. Zone 2 steady ride." },
            { day: getDayStr(4), name: "Rest or Yoga", duration: "30 min", desc: "Active recovery or complete rest." },
            { day: getDayStr(5), name: "HIT: 30/30s", duration: `${hitDuration} min`, desc: "**High Intensity**. 3 sets of 10x(30s hard / 30s easy). VO2 Max focus." },
            { day: getDayStr(6), name: "LIT: Long Ride", duration: `${longDuration} min`, desc: "**Low Intensity**. Long Zone 2 ride to build endurance." }
        ];
    } else {
        // Pyramidal / Standard
        const intervalDuration = Math.round(60 * scale);
        const tempoDuration = Math.round(60 * (hours / 5) * scale);
        const longDuration = Math.round(120 * (hours / 5) * scale);

        plan = [
            { day: getDayStr(0), name: "Rest Day", duration: "0 min", desc: "Recovery day." },
            { day: getDayStr(1), name: "Intervals: VO2 Max", duration: `${intervalDuration} min`, desc: "Warm up, 5x3min at 110-120% FTP. Hard efforts!" },
            { day: getDayStr(2), name: "Endurance Z2", duration: "60 min", desc: "Steady Zone 2 ride." },
            { day: getDayStr(3), name: "Tempo / Sweet Spot", duration: `${tempoDuration} min`, desc: "3x10min at Sweet Spot (88-94% FTP)." },
            { day: getDayStr(4), name: "Recovery", duration: "45 min", desc: "Coffee ride pace (Zone 1)." },
            { day: getDayStr(5), name: "Group Ride / Fartlek", duration: `${intervalDuration} min`, desc: "Unstructured fun ride with some hard efforts." },
            { day: getDayStr(6), name: "Long Ride", duration: `${longDuration} min`, desc: "Long steady distance. Keep it aerobic." }
        ];
    }

    // 4. Generate Markdown Table
    let table = `| Day | Activity Name | Duration | Description with Goal |\n|---|---|---|---|\n`;

    plan.forEach(row => {
        table += `| ${row.day} | ${row.name} | ${row.duration} | ${row.desc} |\n`;
    });

    // 5. Add Important Considerations
    const notes = `
## Important Considerations
*   **Offline Mode**: This plan was generated using a fallback template because the AI service is currently unavailable.
*   **Listen to your body**: Since this isn't fully personalized to your exact fatigue history, adjust intensity if you feel tired.
*   **Feeling**: You reported feeling "${feeling?.toUpperCase() || 'NORMAL'}", and the volume has been scaled by ${Math.round(scale * 100)}%.
    `;

    return table + notes;
}
