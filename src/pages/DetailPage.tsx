import { motion } from 'framer-motion'
import { BookmarkIcon, ChevronLeftIcon, MapPinIcon, Share2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoginPromptModal } from '../components/LoginPromptModal'
import { useAuth } from '../contexts/AuthContext'
import { places } from '../data/mockData'
export const DetailPage: React.FC = () => {
    const { id } = useParams<{
        id: string
    }>()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const place = places.find((p) => p.id === id)
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    if (!place) return <div className="p-6 text-center">장소를 찾을 수 없습니다.</div>
    const handleBookmarkClick = () => {
        if (isAuthenticated) {
            setIsBookmarked(!isBookmarked)
        } else {
            setIsLoginModalOpen(true)
        }
    }
    return (
        <div className="min-h-full bg-background pb-24">
            {/* Header Image & Actions */}
            <div className="relative h-72 md:h-96 w-full">
                <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />

                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                            <Share2Icon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleBookmarkClick}
                            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                        >
                            <BookmarkIcon className={`w-5 h-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Curved bottom edge */}
                <div className="absolute bottom-0 left-0 w-full h-6 bg-background rounded-t-3xl translate-y-1"></div>
            </div>

            {/* Content */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="px-6 pt-2"
            >
                <div className="flex flex-wrap gap-2 mb-3">
                    {place.tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="text-xs font-bold text-primary bg-primary-light/20 px-2.5 py-1 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h1 className="text-2xl font-bold text-text mb-2">{place.name}</h1>

                <div className="flex items-center text-text-muted text-sm mb-6">
                    <MapPinIcon className="w-4 h-4 mr-1.5" />
                    <span>{place.location}</span>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-soft mb-8">
                    <h3 className="font-bold text-text mb-2">어떤 곳인가요?</h3>
                    <p className="text-text-muted leading-relaxed text-sm">{place.description}</p>
                </div>

                {/* Gallery */}
                <div>
                    <h3 className="font-bold text-text mb-4">포토 갤러리</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {place.gallery.map((img, idx) => (
                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden">
                                <img
                                    src={img}
                                    alt={`${place.name} 갤러리 ${idx + 1}`}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <LoginPromptModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onConfirm={() => {
                    setIsLoginModalOpen(false)
                    navigate('/login')
                }}
            />
        </div>
    )
}
