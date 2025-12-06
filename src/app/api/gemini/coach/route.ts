import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { activities, type, questionnaire, targetTSS, feeling } = await request.json();

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
        1. Return the plan ONLY as a Markdown table.
        2. The table MUST have exactly these columns: | Day | Activity Name | Duration | Description with Goal |
        3. The "Day" column must cover Monday to Sunday.
        4. Do NOT include any introductory text or general training notes before the table.
        5. After the table, include a brief section titled "## Important Considerations" with 3-4 bullet points.
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
            return NextResponse.json({ error: 'Missing activities or questionnaire data' }, { status: 400 });
        }

        if (type === 'polarized') {
            prompt += `
            IMPORTANT: Follow the Polarized Training Model.
            - 80% of the training time should be at low intensity (Zone 1/2, easy effort).
            - 20% of the training time should be at high intensity (Zone 4/5, hard effort).
            - Clearly label each session as "LIT" (Low Intensity Training) or "HIT" (High Intensity Training) in the Description.
            - Ensure the total volume respects the 80/20 split.
            `;
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ plan: text });
    } catch (error: any) {
        console.error('Error generating plan:', error);
        return NextResponse.json({
            error: 'Failed to generate plan',
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
