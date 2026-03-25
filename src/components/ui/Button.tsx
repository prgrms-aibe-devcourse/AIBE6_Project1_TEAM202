import { HTMLMotionProps, motion } from 'framer-motion'
import React, { forwardRef } from 'react'
interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    children: React.ReactNode
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', fullWidth = false, children, className = '', ...props }, ref) => {
        const baseStyles =
            'inline-flex items-center justify-center font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
        const variants = {
            primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
            secondary: 'bg-secondary text-white hover:bg-secondary-light focus:ring-secondary',
            ghost: 'bg-transparent text-text-muted hover:bg-gray-100 hover:text-text focus:ring-gray-200',
            outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
        }
        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        }
        const widthStyle = fullWidth ? 'w-full' : ''
        return (
            <motion.button
                ref={ref}
                whileHover={{
                    scale: 1.02,
                }}
                whileTap={{
                    scale: 0.98,
                }}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
                {...props}
            >
                {children}
            </motion.button>
        )
    },
)
Button.displayName = 'Button'
