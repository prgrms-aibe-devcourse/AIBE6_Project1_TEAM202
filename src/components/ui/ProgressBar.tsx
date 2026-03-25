import { motion } from 'framer-motion'
import React from 'react'
interface ProgressBarProps {
    current: number
    total: number
}
export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const percentage = Math.round((current / total) * 100)
    return (
        <div className="w-full">
            <div className="flex justify-between text-sm font-medium text-text-muted mb-2 px-1">
                <span>Q{current}</span>
                <span>{percentage}%</span>
            </div>
            <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{
                        width: 0,
                    }}
                    animate={{
                        width: `${percentage}%`,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeOut',
                    }}
                />
            </div>
        </div>
    )
}
