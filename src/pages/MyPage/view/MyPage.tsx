import { motion } from 'framer-motion'
import { BookmarkIcon, LogOutIcon, MapPinIcon, PencilIcon, UserIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'

type Profile = {
    id: string
    nickname: string | null
    avatar_url: string | null
    created_at: string
    result_type: string | null
}
// 프로필 성향 타입 매핑
const typeLabel: Record<string, string> = {
    HEALING: '감성 힐링 여행가',
    CALM: '고요 추구 여행가',
    FOOD: '맛집 집착형 여행가',
    PHOTO: '인스타 감성 수집가',
    SHOPPING: '소비형 도시 탐험가',
    EXPLORER: '개척자형 여행가',
}

type Bookmark = {
    id: string
    user_id: string
    place_name: string
    post_id: string | null
    created_at: string
}

export const MyPage: React.FC = () => {
    const navigate = useNavigate()
    const { user, logout, isAuthenticated, isLoading, displayName, profileImage } = useAuth()

    const [activeTab, setActiveTab] = useState<'bookmarks' | 'posts'>('bookmarks')
    const [profile, setProfile] = useState<Profile | null>(null)
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [myPosts, setMyPosts] = useState<any[]>([])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, isLoading, navigate])

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return

            const { data, error } = await supabase
                .from('users')
                .select('id, nickname, avatar_url, created_at, result_type')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('프로필 조회 실패:', error)
                return
            }

            setProfile(data)
        }

        fetchProfile()
    }, [user])

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!user) return

            const { data, error } = await supabase
                .from('bookmarks')
                .select('id, user_id, place_name, post_id, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('북마크 조회 실패:', error)
                return
            }

            setBookmarks(data ?? [])
        }

        fetchBookmarks()
    }, [user])

    useEffect(() => {
        const fetchMyPosts = async () => {
            if (!user) return

            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('내 게시글 조회 실패:', error)
                return
            }

            setMyPosts(data ?? [])
        }

        fetchMyPosts()
    }, [user])

    const handleDeleteBookmark = async (bookmarkId: string) => {
        const ok = window.confirm('이 북마크를 삭제할까요?')
        if (!ok) return

        const { error } = await supabase.from('bookmarks').delete().eq('id', bookmarkId)

        if (error) {
            console.error('북마크 삭제 실패:', error)
            alert('북마크 삭제에 실패했습니다.')
            return
        }

        setBookmarks((prev) => prev.filter((item) => item.id !== bookmarkId))
    }

    const handleDeletePost = async (postId: string) => {
        const ok = window.confirm('이 게시글을 삭제할까요?')
        if (!ok) return

        const { error } = await supabase.from('posts').delete().eq('id', postId)

        if (error) {
            console.error('게시글 삭제 실패:', error)
            alert('게시글 삭제에 실패했습니다.')
            return
        }

        setMyPosts((prev) => prev.filter((item) => item.id !== postId))
    }

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/')
        } catch (error) {
            console.error('로그아웃 실패:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <p className="text-sm text-text-muted">사용자 정보를 불러오는 중...</p>
            </div>
        )
    }

    if (!user) {
        return null
    }

    const handleDeleteAccount = async () => {
        if (!user) return

        const ok = window.confirm('정말 탈퇴하시겠어요?\n탈퇴 시 서비스 데이터가 삭제되고, 카카오 연결도 해제됩니다.')
        if (!ok) return

        try {
            const { data, error } = await supabase.functions.invoke('unlink-kakao-and-delete-account')

            if (error) {
                console.error('회원 탈퇴 실패 FULL:', error)

                // 🔥 핵심 추가
                const res = error.context
                if (res) {
                    const text = await res.text()
                    console.error('Edge Function 실제 에러:', text)
                }

                alert('회원 탈퇴 실패')
                return
            }

            console.log('unlink 결과:', data)

            await logout()
            alert('탈퇴가 완료되었습니다.')
            navigate('/')
        } catch (error) {
            console.error('회원 탈퇴 중 오류:', error)
            alert('회원 탈퇴 중 오류가 발생했습니다.')
        }
    }

    const email = user.email ?? '이메일 정보 없음'
    const nickname = profile?.nickname || displayName
    const avatarSrc = profile?.avatar_url || profileImage || 'https://i.pravatar.cc/150?img=12'

    return (
        <div className="min-h-full bg-background pb-24">
            <div className="px-6 pt-8 pb-6">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img src={avatarSrc} alt={nickname} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold text-text truncate">{nickname}</h1>

                            <button
                                type="button"
                                onClick={() => navigate('/my/edit-profile')}
                                className="shrink-0 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-text hover:bg-gray-50 transition-colors"
                            >
                                <PencilIcon className="w-3.5 h-3.5" />
                                수정
                            </button>
                        </div>

                        <p className="text-sm text-text-muted truncate">{email}</p>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 mt-3">
                            <UserIcon className="w-4 h-4 text-text-muted" />
                            <span className="text-xs font-semibold text-text">
                                {' '}
                                {profile?.result_type ? typeLabel[profile.result_type] : '테스트를 진행하세요!'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <Button
                        variant="primary"
                        fullWidth
                        className="py-2.5 text-sm"
                        onClick={() => {
                            const savedResult = profile?.result_type
                            if (savedResult) {
                                navigate(`/result/${savedResult}`)
                            } else {
                                navigate('/test')
                            }
                        }}
                    >
                        내 결과 보기
                    </Button>
                </div>
            </div>

            <div className="px-6 mb-4">
                <div className="grid grid-cols-2 bg-gray-100 rounded-2xl p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('bookmarks')}
                        className={`py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            activeTab === 'bookmarks' ? 'bg-white text-text' : 'text-text-muted'
                        }`}
                    >
                        저장한 장소
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('posts')}
                        className={`py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            activeTab === 'posts' ? 'bg-white text-text' : 'text-text-muted'
                        }`}
                    >
                        내 게시글
                    </button>
                </div>
            </div>

            <div className="px-6 space-y-3">
                {activeTab === 'bookmarks' && bookmarks.length === 0 && (
                    <Card className="p-6 text-center">
                        <BookmarkIcon className="w-6 h-6 mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-text-muted">저장한 장소가 없습니다.</p>
                    </Card>
                )}

                {activeTab === 'bookmarks' &&
                    bookmarks.map((item) => (
                        <Card
                            key={item.id}
                            className="p-4 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
                            onClick={() => navigate(`/community/${item.post_id}`)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                    <BookmarkIcon className="w-5 h-5 text-text-muted" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-text">{item.place_name}</h3>
                                    <p className="text-sm text-text-muted mt-1">
                                        저장일: {new Date(item.created_at).toLocaleDateString('ko-KR')}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleDeleteBookmark(item.id)
                                    }}
                                    className="text-sm text-red-500 hover:text-red-600 shrink-0"
                                >
                                    삭제
                                </button>
                            </div>
                        </Card>
                    ))}

                {activeTab === 'posts' && myPosts.length === 0 && (
                    <Card className="p-4">
                        <p className="text-sm text-text-muted text-center">작성한 게시글이 없습니다.</p>
                    </Card>
                )}

                {activeTab === 'posts' &&
                    myPosts.map((item) => (
                        <Card
                            key={item.id}
                            className="p-4 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
                            onClick={() => navigate(`/community/${item.id}`)}
                        >
                            <div className="flex items-start gap-3">
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                        <MapPinIcon className="w-5 h-5 text-text-muted" />
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-bold text-text text-base truncate">{item.title}</h3>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleDeletePost(item.id)
                                            }}
                                            className="text-sm text-red-500 hover:text-red-600 shrink-0"
                                        >
                                            삭제
                                        </button>
                                    </div>

                                    <p className="text-sm text-text-muted mt-1 line-clamp-2">
                                        {item.content || '내용이 없습니다.'}
                                    </p>
                                    <p className="text-xs text-text-muted mt-2">
                                        {new Date(item.created_at).toLocaleDateString('ko-KR')}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
            </div>

            <div className="px-6 mt-10 space-y-3">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-500 bg-white border border-red-100 rounded-2xl hover:bg-red-50 transition-colors"
                >
                    <LogOutIcon className="w-4 h-4" />
                    로그아웃
                </button>
            </div>
            <div className="px-6 mt-3">
                <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                    회원 탈퇴
                </button>
            </div>
        </div>
    )
}
