import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeftIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { useAuth } from '../../../contexts/AuthContext'
import { questions } from '../../../data/mock/questions'
import { AnswerOption, TravelType } from '../../../data/mockData'
import { saveTestResult } from '../../../services/testCountApi'
import { ProgressBar } from '../component/ProgressBar'
export const TestPage: React.FC = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<TravelType[]>([])
    const [direction, setDirection] = useState(1)
    const currentQuestion = questions[currentIndex]

    const handleAnswer = async (option: AnswerOption) => {
        const newAnswers = [...answers, option]
        setAnswers(newAnswers)
        if (currentIndex < questions.length - 1) {
            setDirection(1)
            setCurrentIndex(currentIndex + 1)
        } else {
            const scores = calculateScores(newAnswers)
            const maxScore = Math.max(...Object.values(scores))
            const topKeys = (Object.keys(scores) as TravelType[]).filter((k) => scores[k] === maxScore)
            const resultType = topKeys.sort((a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b))[0]

            try {
                await saveTestResult(resultType, user?.id)
            } catch (error) {
                console.error('테스트 결과 저장 실패', error)
            }
            navigate(`/result/${resultType}`, { replace: true })
        }
    }
    const handleBack = () => {
        if (currentIndex > 0) {
            setDirection(-1)
            setCurrentIndex(currentIndex - 1)
            setAnswers(answers.slice(0, -1))
        } else {
            navigate(-1)
        }
    }
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
        }),
    }
    return (
        <div className="min-h-full bg-background flex flex-col pt-6 px-6 pb-12">
            <div className="flex items-center mb-6">
                <button onClick={handleBack} className="p-2 -ml-2 text-text-muted hover:text-text transition-colors">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex-1 px-4">
                    <ProgressBar current={currentIndex + 1} total={questions.length} />
                </div>
                <div className="w-10" /> {/* Spacer for balance */}
            </div>

            <div className="flex-1 relative flex flex-col justify-center">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="w-full"
                    >
                        <h2 className="text-2xl font-bold text-text mb-10 text-center text-balance leading-relaxed">
                            {currentQuestion.text}
                        </h2>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, idx) => (
                                <Card
                                    key={idx}
                                    hoverable
                                    onClick={() => handleAnswer(option.type)}
                                    className="p-5 cursor-pointer border border-transparent hover:border-primary-light hover:bg-primary/5 transition-all active:scale-95"
                                >
                                    <p className="text-center font-medium text-text">{option.text}</p>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
