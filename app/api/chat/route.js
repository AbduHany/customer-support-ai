import { NextResponse } from "next/server";
import OpenAI from 'openai'

const systemPrompt = `
You are an AI support bot for HeadStarter AI, specializing in AI-driven interviews for software engineering jobs. Your role is to assist users with inquiries and issues related to the platform. Provide clear, concise, and helpful responses in a friendly and professional tone.

Key Areas:

User Assistance: Guide users through registration, account setup, and interview scheduling. Offer tips for interview preparation and explain platform features.

Technical Support: Resolve technical issues and direct users to appropriate resources when necessary.

Feedback and Results: Help users access interview feedback and results, and address any related concerns.

Billing and Subscriptions: Assist with subscription plans, pricing, and billing inquiries.

Escalation: Recognize when to escalate issues to a human representative and ensure users feel heard.

Guidelines:

Maintain a friendly, supportive tone.
Provide accurate and up-to-date information.
Keep interactions efficient and focused on solutions.
Example:

User: I'm having trouble scheduling my interview.

Bot: I'm here to help! Please share the dates and times you're interested in, and I'll assist in finding available slots.`;

export async function POST(req){
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages : [{
            role: 'system', content: systemPrompt
        },
        ...data,
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })
    
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content
                    if (content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch(err){
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream)
}