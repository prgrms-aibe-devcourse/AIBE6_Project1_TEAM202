import { GoogleGenAI } from '@google/genai'
import createPlacecPrompt from '../prompt'
import { mockTestCount } from './mockData'
import { TestCountResponse } from './types'

export const getTestCount = async (): Promise<TestCountResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ count: mockTestCount })
        }, 300)
    })
}

const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3-flash', 'gemini-3.1-flash-lite']

export async function requestGemini(request: string) {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! })
    const prompt = createPlacecPrompt(request)

    const result = await (async () => {
        for (const model of models) {
            try {
                return await ai.models.generateContent({
                    model,
                    contents: prompt,
                })
            } catch (e: any) {
                if (!e.message?.includes('429')) throw e
            }
        }
        throw new Error('All models quota exceeded')
    })()

    if (result !== undefined) return JSON.parse(result.text!)
    else return console.log('AI 응답 실패')
}
