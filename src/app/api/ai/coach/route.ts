import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { generateFallbackPlan } from '@/lib/fallbackPlans';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ''); // Moved inside handler

export async function POST(request: Request) {
    const apiKey = process.env.GEMINI_API_KEY;

    // Parse body first to have params for fallback
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON request' }, { status: 400 });
    }

    const { activities, type, questionnaire, targetTSS, feeling } = body;

    // Helper to return fallback
    const useFallback = (reason: string) => {
        console.warn(`Ref to Fallback: ${reason}`);
        const plan = generateFallbackPlan({
            type,
            feeling,
            targetTSS,
            hours: questionnaire?.hours || 5
        });
        return NextResponse.json({ plan });
    };

    if (!process.env.GROQ_API_KEY) {
        return useFallback('Groq API Key missing');
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
        let prompt = '';

        // Calculate dates for the current week (Monday to Sunday)
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const mondayDate = new Date(today.setDate(diffToMonday));
        const sundayDate = new Date(mondayDate);
        sundayDate.setDate(mondayDate.getDate() + 6);

        const dateRangeString = `${mondayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} to ${sundayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;

        let tssInstruction = '';
        if (targetTSS && feeling) {
            tssInstruction = `
            TARGET WEEKLY TSS: ${targetTSS}
            USER FEELING: ${feeling.toUpperCase()}
            
            ADJUSTMENT RULES:
            - If feeling is SAD (Tired): Prioritize recovery. Keep intensity low. Total TSS should be close to ${targetTSS}.
            - If feeling is NORMAL: Standard training week. Total TSS should be close to ${targetTSS}.
            - If feeling is HAPPY (Fresh): Push week. Include challenging intervals. Total TSS should be close to ${targetTSS}.
            `;
        }

        const commonInstructions = `
        Based on this profile/history, please suggest a detailed training plan for the week of ${dateRangeString}.
        
        ${tssInstruction}

        STRICT OUTPUT FORMATTING RULES:
        1. Return the plan ONLY as a valid JSON object. Do not include any text before or after the JSON.
        2. Follow this exact JSON structure:
        {
            "weekly_summary": "Brief explanation of the week's focus (2 sentences max).",
            "workouts": [
                {
                    "day": "Monday",
                    "activity_name": "Activity Title",
                    "duration": "60 min",
                    "description": "Detailed description of the workout.",
                    "type": "Ride" | "Run" | "Swim" | "Rest", 
                    "structure": [
                        { "segment_type": "Warm Up" | "Active" | "Interval" | "Recovery" | "Cool Down", "duration_minutes": 10, "intensity_pct_ftp": 0.50 }
                    ]
                }
            ]
        }
        3. For "Rest" days, return an empty structure array.
        4. For structured workouts (Intervals), break them down into segments in the "structure" array. 
           - intensity_pct_ftp: 0.5 = 50% FTP (Recovery), 0.7 = Endurance, 0.9 = Sweetspot, 1.0 = Threshold, 1.2 = VO2 Max.
        `;

        if (questionnaire) {
            prompt = `
            Act as an expert running and fitness coach.
            I am a beginner/intermediate athlete with the following profile:
            - Sports: ${questionnaire.sports.join(', ')}
            - Goals: ${questionnaire.goals.join(', ')}
            - Weekly Training Hours: ${questionnaire.hours}

            ${commonInstructions}
            `;
        } else if (activities && Array.isArray(activities)) {
            // Format activities for the prompt
            const activitySummary = activities.map((a: any) => {
                return `- ${a.name} (${a.type}): ${(a.distance / 1000).toFixed(2)}km in ${Math.floor(a.moving_time / 60)}min on ${new Date(a.start_date).toLocaleDateString()}`;
            }).join('\n');

            prompt = `
            Act as an expert running and fitness coach.
            Here is my training history for the last 30 days:
            ${activitySummary}

            ${commonInstructions}
            `;
        } else {
            // If missing data, also use fallback rather than 400
            return useFallback('Missing activities or questionnaire data');
        }

        if (type === 'polarized') {
            prompt += `
            IMPORTANT: Follow the Polarized Training Model.
            - 80% of the training time should be at low intensity (Zone 1/2, easy effort).
            - 20% of the training time should be at high intensity (Zone 4/5, hard effort).
            - Ensure the total volume respects the 80/20 split.
            `;
        }

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2, // Lower temp for valid JSON
            response_format: { type: "json_object" }, // Force JSON mode
        });

        const text = completion.choices[0]?.message?.content || "";

        if (!text) {
            throw new Error('Empty response from Groq');
        }

        return NextResponse.json({ plan: text });
    } catch (error: any) {
        console.error('Error generating plan with Groq, switching to fallback:', error);
        return useFallback(error.message || 'Groq Usage Error');
    }
}
