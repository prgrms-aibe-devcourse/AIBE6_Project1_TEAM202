import { motion } from 'framer-motion'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlaceCard } from '../../../components/shared/PlaceCard'
import { PostCard } from '../../../components/shared/PostCard'
import { Button } from '../../../components/ui/Button'
import { useAuth } from '../../../contexts/AuthContext'
import { places, posts, resultTypes } from '../../../data/mockData'
export const MyPage: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'saved' | 'posts'>('saved')
    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate])
    if (!user) return null
    const travelTypeInfo = resultTypes[user.travelType]
    const savedPlaces = places.slice(0, 2) // Mock saved places
    const userPosts = posts.filter((p) => p.author.id === user.id) // Mock user posts
    const handleLogout = () => {
        logout()
        navigate('/')
    }
    return (
        <div className="min-h-full bg-background pb-24">
            {/* Profile Header */}
            <div className="bg-white pt-12 pb-8 px-6 rounded-b-[2rem] shadow-sm mb-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-background shadow-sm">
                        <img src={user.avatar} alt={user.nickname} className="w-full h-full object-cover" />
                    </div>
                    <button className="p-2 text-text-muted hover:text-text bg-gray-50 rounded-full transition-colors">
                        <SettingsIcon className="w-5 h-5" />
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-text mb-2">{user.nickname}</h1>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 mb-4">
                    <span className="text-lg">{travelTypeInfo.emoji}</span>
                    <span className="text-sm font-bold text-text">{travelTypeInfo.title}</span>
                </div>

                <p className="text-sm text-text-muted mb-6">{user.email}</p>

                <div className="flex gap-3">
                    <Button variant="outline" fullWidth className="py-2.5 text-sm" onClick={() => navigate('/test')}>
                        테스트 다시하기
                    </Button>
                    <Button
                        variant="primary"
                        fullWidth
                        className="py-2.5 text-sm"
                        onClick={() => navigate(`/result/${user.travelType}`)}
                    >
                        내 결과 보기
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 mb-6 flex gap-6 border-b border-gray-200">
                <button
                    className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'saved' ? 'text-text' : 'text-text-muted'}`}
                    onClick={() => setActiveTab('saved')}
                >
                    저장한 장소
                    {activeTab === 'saved' && (
                        <motion.div
                            layoutId="tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-text"
                        />
                    )}
                </button>
                <button
                    className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'posts' ? 'text-text' : 'text-text-muted'}`}
                    onClick={() => setActiveTab('posts')}
                >
                    내 게시글
                    {activeTab === 'posts' && (
                        <motion.div
                            layoutId="tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-text"
                        />
                    )}
                </button>
            </div>

            {/* Tab Content */}
            <div className="px-6 space-y-4">
                {activeTab === 'saved' ? (
                    <div className="grid grid-cols-2 gap-4">
                        {savedPlaces.map((place) => (
                            <PlaceCard key={place.id} place={place} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userPosts.length > 0 ? (
                            userPosts.map((post) => <PostCard key={post.id} post={post} />)
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-text-muted text-sm mb-4">아직 작성한 게시글이 없어요</p>
                                <Button variant="outline" size="sm" onClick={() => navigate('/create-post')}>
                                    첫 글 작성하기
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="px-6 mt-12">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-text-muted hover:text-red-500 transition-colors"
                >
                    <LogOutIcon className="w-4 h-4" />
                    로그아웃
                </button>
            </div>
        </div>
    )
}
