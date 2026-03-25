'use client'
import { GoogleGenAI } from '@google/genai'
import { motion } from 'framer-motion'
import { HomeIcon, RotateCcwIcon, Share2Icon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PlaceCard } from '../components/PlaceCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { geminiAPIKey } from '../data/apikey'
import { places, resultTypes, TravelType } from '../data/mockData'
import createPlacecPrompt from '../data/prompt'

export const ResultPage: React.FC = () => {
    async function requestGemini(request: string) {
        const ai = new GoogleGenAI({ apiKey: geminiAPIKey })
        const prompt = createPlacecPrompt(request)

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        })

        if (result !== undefined) return console.log(result.text)
        else return console.log('AI 응답 실패')
    }

    const { type } = useParams<{
        type: string
    }>()
    const navigate = useNavigate()
    const result = resultTypes[type as TravelType]
    useEffect(() => {
        if (!result) {
            navigate('/')
        }
    }, [result, navigate])

    if (!result) return null

    requestGemini(result.title)

    const recommendedPlaces = places.filter((p) => p.type === result.id)
    return (
        <div className="min-h-full bg-background pb-24 overflow-y-auto">
            {/* Result Header */}
            <div className={`${result.color} pt-12 pb-8 px-6 rounded-b-[3rem] shadow-sm mb-8 relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="relative z-10 flex flex-col items-center text-center"
                >
                    <span className="text-sm font-bold text-text/60 mb-2 bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                        나의 여행 성향은
                    </span>
                    <div className="text-7xl mb-4 drop-shadow-md">{result.emoji}</div>
                    <h1 className="text-3xl font-bold text-text mb-2">{result.title}</h1>
                    <p className="text-text/80 font-medium mb-6">{result.subtitle}</p>

                    <Card className="p-6 text-left bg-white/90 backdrop-blur w-full">
                        <p className="text-text leading-relaxed text-sm">{result.description}</p>
                    </Card>
                </motion.div>
            </div>

            <div className="px-6 space-y-8">
                {/* Actions */}
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.3,
                    }}
                    className="flex gap-3"
                >
                    <Button variant="primary" fullWidth className="gap-2 shadow-md shadow-primary/20">
                        <Share2Icon className="w-5 h-5" />
                        결과 공유하기
                    </Button>
                    <Button
                        variant="secondary"
                        className="px-4"
                        onClick={() => navigate('/test')}
                        aria-label="다시하기"
                    >
                        <RotateCcwIcon className="w-5 h-5" />
                    </Button>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.5,
                    }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✨</span>
                        <h2 className="text-xl font-bold text-text">이런 곳은 어때요?</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recommendedPlaces.map((place) => (
                            <PlaceCard key={place.id} place={place} />
                        ))}
                    </div>
                </motion.div>

                <div className="pt-4 pb-8 flex justify-center">
                    <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
                        <HomeIcon className="w-4 h-4" />
                        홈으로 돌아가기
                    </Button>
                </div>
            </div>
        </div>
    )
}
