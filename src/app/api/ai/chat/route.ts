import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { blogPosts } from '@/data/blogPosts';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
    if (!process.env.GROQ_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error: Groq API Key missing' }, { status: 500 });
    }

    try {
        const { messages, context } = await request.json();

        // Prepare blog knowledge base
        const blogSummary = blogPosts.map(post =>
            `- Title: "${post.title}" (Slug: ${post.slug}) \n  Summary: ${post.excerpt}`
        ).join('\n');

        const systemPrompt = `
        You are Coach Juno, an expert, encouraging, and data-driven cycling and endurance coach.
        
        You are chatting with an athlete inside their training dashboard.
        
        ## CURRENT ATHLETE CONTEXT
        Here is the live data from their dashboard:
        ${JSON.stringify(context, null, 2)}
        
        ## YOUR KNOWLEDGE BASE (BLOG)
        You have written the following articles. If a user asks a question relevant to these topics, answer briefly and then RECOMMEND the article by title and slug.
        ${blogSummary}
        
        ## RULES
        1. **SCOPE RESTRICTION**: You are a SPORTS COACH. You MUST ONLY answer questions related to:
           - The user's specific training data (Context provided).
           - Cycling, running, swimming, and endurance sports.
           - Health, nutrition, recovery, and physiology.
           - The usage of this specific dashboard app.
           
           **IF the user asks about anything else (e.g., coding, politics, general knowledge, movies), politely REFUSE.** 
           Example refusal: "I'm just a sports coach, I can't help with that. Let's talk about your training!"

        2. **Be Concise**: Keep answers short (2-3 sentences max) unless asked to explain in depth. Chat windows are small.
        3. **Be Encouraging**: Use a positive, coaching tone.
        4. **Use Context**: If they ask "How is my week?", use the data provided in the context to answer specifically.
        5. **Formatting**: You can use simple Markdown (bold, italics).
        `;

        // Prepare messages for Groq (Llama 3)
        // System message goes first
        const allMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        const completion = await groq.chat.completions.create({
            messages: allMessages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || "I'm not sure how to answer that.";

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
