import { motion } from 'framer-motion'
import { CameraIcon, HeartIcon, MapIcon, UtensilsIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
const stylePreviews = [
    {
        id: 'HEALING',
        title: '감성 힐링',
        icon: HeartIcon,
        color: 'bg-warm',
        text: 'text-orange-600',
    },
    {
        id: 'CITY',
        title: '도시 탐험',
        icon: MapIcon,
        color: 'bg-secondary-light',
        text: 'text-indigo-600',
    },
    {
        id: 'FOOD',
        title: '맛집 투어',
        icon: UtensilsIcon,
        color: 'bg-accent',
        text: 'text-teal-600',
    },
    {
        id: 'PHOTO',
        title: '포토 여행',
        icon: CameraIcon,
        color: 'bg-primary-light',
        text: 'text-pink-600',
    },
]

export const HomePage: React.FC = () => {
    const navigate = useNavigate()
    const containerVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }
    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
        },
    }
    return (
        <div className="min-h-full bg-gradient-to-b from-background to-warm/20 pb-24 pt-12 px-6 overflow-y-auto">
            <motion.div
                className="flex flex-col items-center text-center mb-12"
                initial={{
                    opacity: 0,
                    scale: 0.9,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                }}
                transition={{
                    duration: 0.5,
                }}
            >
                <div className="w-24 h-24 bg-white rounded-full shadow-soft flex items-center justify-center mb-6">
                    <span className="text-5xl">✈️</span>
                </div>
                <h1 className="text-3xl font-bold text-text mb-3 text-balance">
                    나에게 딱 맞는
                    <br />
                    <span className="text-primary">여행 스타일</span>은?
                </h1>
                <p className="text-text-muted mb-8 text-balance">
                    단 1분 만에 알아보는 나의 여행 성향과
                    <br />
                    찰떡궁합 추천 여행지 ✨
                </p>

                <Button
                    size="lg"
                    fullWidth
                    onClick={() => navigate('/test')}
                    className="shadow-lg shadow-primary/30 text-lg"
                >
                    테스트 시작하기
                </Button>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-8">
                <h2 className="text-sm font-bold text-text-muted mb-4 px-2">이런 타입들이 있어요 👀</h2>
                <div className="grid grid-cols-2 gap-4">
                    {stylePreviews.map((style) => (
                        <motion.div key={style.id} variants={itemVariants}>
                            <Card className="p-4 flex flex-col items-center text-center h-full border border-gray-50">
                                <div
                                    className={`w-12 h-12 rounded-full ${style.color} flex items-center justify-center mb-3`}
                                >
                                    <style.icon className={`w-6 h-6 ${style.text}`} />
                                </div>
                                <h3 className="font-bold text-text text-sm">{style.title}</h3>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
