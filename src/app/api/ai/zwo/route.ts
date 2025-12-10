import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
    if (!process.env.GROQ_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error: Groq API Key missing' }, { status: 500 });
    }

    try {
        const { workoutName, workoutDescription, ftp, maxHr } = await request.json();

        if (!workoutDescription) {
            return NextResponse.json({ error: 'Workout description is required' }, { status: 400 });
        }

        const systemPrompt = `
        You are an expert cycling coach and technical expert in Zwift file formatting.
        
        Your task is to take a workout description and convert it into a VALID Zwift (.zwo) XML format.

        ## USER DATA
        - FTP: ${ftp || 'Not Set (Default to 250)'}
        - Max HR: ${maxHr || 'Not Set (Default to 190)'}

        ## RULES
        1. **Strict XML output**: Return ONLY the XML code. No markdown, no explanations.
        2. **Format**: Follow the example below exactly.
        3. **Power Calculation**: 
            - If the description says "Zone 2", use Power="0.65".
            - If it says "115% FTP", use Power="1.15".
            - If it says "Easy spin", use Power="0.50".
            - Infer sensible power targets based on the description if not explicit.
        4. **Cadence**: Default to 85-95 rpm for intervals, 70-80 for recovery if not specified. Or leave pace="0" if unsure.
        5. **Intervals**: Break down the workout into <SteadyState>, <IntervalsT>, <Warmup>, <Cooldown> etc. as appropriate, or just sequential <SteadyState> blocks.

        ## EXAMPLE OUTPUT (Template)
        <?xml version='1.0' encoding='utf-8'?>
        <workout_file>
            <author>Coachweek AI</author>
            <name>${workoutName || 'Coachweek Workout'}</name>
            <description>${workoutDescription}</description>
            <sportType>bike</sportType>
            <tags>
                <tag name="Coachweek"/>
            </tags>
            <workout>
                <SteadyState Duration="180" Power="0.50" pace="0">
                    <textevent timeoffset="0" message="Warm up gently." />
                </SteadyState>
                <!-- Add more blocks here based on description -->
            </workout>
        </workout_file>
        `;

        const userMessage = `
        Convert this workout into a .zwo XML file:
        
        Workout Name: ${workoutName}
        Description: ${workoutDescription}
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2, // Low temperature for precise formatting
            max_tokens: 2048,
        });

        let xmlContent = completion.choices[0]?.message?.content || "";

        // Cleanup markdown code blocks if present
        xmlContent = xmlContent.replace(/```xml/g, '').replace(/```/g, '').trim();

        return NextResponse.json({ xmlContent, filename: `${workoutName?.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.zwo` });

    } catch (error: any) {
        console.error('ZWO Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate ZWO file' }, { status: 500 });
    }
}
