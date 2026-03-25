import { motion } from 'framer-motion'
import { ChevronLeftIcon, LockIcon, MailIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../contexts/AuthContext'
export const LoginPage: React.FC = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (email && password) {
            login(email)
            navigate(-1) // Go back to previous page
        }
    }
    return (
        <div className="min-h-full bg-background flex flex-col">
            <div className="p-4 flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-text-muted hover:text-text transition-colors"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
            </div>

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="flex-1 px-6 flex flex-col justify-center pb-20"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-4 text-3xl">
                        👋
                    </div>
                    <h1 className="text-2xl font-bold text-text mb-2">다시 만나서 반가워요!</h1>
                    <p className="text-text-muted text-sm">로그인하고 나만의 여행 스타일을 찾아보세요</p>
                </div>

                <Card className="p-6 mb-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-text mb-1.5">이메일</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                    <MailIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="hello@poomang.com"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text mb-1.5">비밀번호</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                    <LockIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" fullWidth className="mt-2 shadow-md shadow-primary/20">
                            로그인하기
                        </Button>
                    </form>
                </Card>

                <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#FEE500] text-[#000000] rounded-xl font-bold text-sm hover:bg-[#FEE500]/90 transition-colors">
                        카카오로 시작하기
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-text rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                        Google로 시작하기
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-text-muted">
                        계정이 없으신가요?{' '}
                        <Link to="/signup" className="font-bold text-primary hover:underline">
                            회원가입
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
