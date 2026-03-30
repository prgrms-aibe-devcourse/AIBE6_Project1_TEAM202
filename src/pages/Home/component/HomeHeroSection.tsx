import { motion } from 'framer-motion'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import palette from '../../../assets/icons/palette.png'
import { Button } from '../../../components/ui/Button'
import { scaleIn } from '../../../core/constants/animation'

export const HomeHeroSection: React.FC = () => {
    const navigate = useNavigate()

    const handleStartTest = () => {
        navigate('/test')
    }

    return (
        <motion.section
            className="mb-12 flex flex-col items-center text-center"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
        >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-soft">
                <img src={palette} className="rounded-full object-cover" />
            </div>

            <h1 className="mb-3 text-3xl font-bold text-text text-balance">
                나에게 딱 맞는
                <br />
                <span className="text-primary">여행 스타일</span>은?
            </h1>

            <p className="mb-8 text-text-muted text-balance">
                단 1분 만에 알아보는 나의 여행 성향과
                <br />
                찰떡궁합 추천 여행지 ✨
            </p>

            <Button size="lg" fullWidth onClick={handleStartTest} className="text-lg shadow-lg shadow-primary/30">
                테스트 시작하기
            </Button>
        </motion.section>
    )
}
