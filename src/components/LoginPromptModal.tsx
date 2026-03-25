import { AnimatePresence, motion } from 'framer-motion'
import { LockIcon, XIcon } from 'lucide-react'
import React from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
interface LoginPromptModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}
export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        }}
                        className="relative w-full max-w-sm"
                    >
                        <Card className="p-6 text-center shadow-2xl">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>

                            <div className="w-16 h-16 bg-primary-light/30 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <LockIcon className="w-8 h-8" />
                            </div>

                            <h3 className="text-xl font-bold text-text mb-2">로그인이 필요해요</h3>
                            <p className="text-text-muted text-sm mb-6">이 기능을 사용하려면 먼저 로그인해주세요.</p>

                            <div className="flex flex-col gap-2">
                                <Button fullWidth onClick={onConfirm}>
                                    로그인하기
                                </Button>
                                <Button variant="ghost" fullWidth onClick={onClose}>
                                    취소
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
