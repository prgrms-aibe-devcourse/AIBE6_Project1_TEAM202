import { GoogleGenAI } from '@google/genai'

export async function POST(req: Request) {
    try {
        const { request } = await req.json()

        const apiKey = process.env.GEMINI_API_KEY

        console.log(apiKey)

        const ai = new GoogleGenAI({
            apiKey: apiKey,
        })

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: request,
        })

        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'AI request failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
