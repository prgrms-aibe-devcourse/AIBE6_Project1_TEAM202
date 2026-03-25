import { motion } from 'framer-motion'
import { ChevronLeftIcon, ImageIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { TravelType, resultTypes } from '../data/mockData'
export const CreatePostPage: React.FC = () => {
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuth()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [selectedType, setSelectedType] = useState<TravelType>(user?.travelType || 'HEALING')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate])
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock submission
        if (title && content) {
            navigate('/community')
        }
    }
    return (
        <div className="min-h-full bg-background flex flex-col pb-safe">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-4 py-3 flex items-center justify-between border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-text hover:text-primary transition-colors"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold text-text">게시글 작성</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <motion.div
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="flex-1 p-6"
            >
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-text mb-2">사진 업로드</label>
                        {imagePreview ? (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />

                                <button
                                    type="button"
                                    onClick={() => setImagePreview(null)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center aspect-video w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-500">사진을 선택해주세요</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-text mb-2">제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-bold text-text mb-2">내용</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="여행 이야기를 들려주세요..."
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none min-h-[150px]"
                            required
                        />
                    </div>

                    {/* Travel Type Tag */}
                    <div className="pb-20">
                        <label className="block text-sm font-bold text-text mb-2">여행 스타일 태그</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(resultTypes) as TravelType[]).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setSelectedType(type)}
                                    className={`px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${selectedType === type ? 'bg-text text-white shadow-md' : 'bg-white border border-gray-200 text-text-muted hover:bg-gray-50'}`}
                                >
                                    <span>{resultTypes[type].emoji}</span>
                                    {resultTypes[type].title.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button (Fixed Bottom) */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 pb-safe">
                        <Button type="submit" fullWidth className="shadow-lg shadow-primary/20">
                            게시하기
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
