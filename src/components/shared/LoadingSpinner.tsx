import { motion } from 'framer-motion'
import React from 'react'

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="min-h-full flex flex-col items-center justify-center bg-background">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
            <p className="mt-4 text-text/60 font-medium">결과 불러오는 중...</p>
        </div>
    )
}
