import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import { getPosts, Post, PostSortType, toggleLike } from '../../../services/testPostApi'
import { FilterBar } from '../components/filterBar'
import { LoginModal } from '../components/LoginModal'
import { PostFeed } from '../components/postFeed'

import { SortDropdown } from '../components/SortDropdown'
import { WriteButton } from '../components/writeButton'
import { useCommunityFilter } from '../hooks/useCommunityFilter'

export const CommunityPage: React.FC = () => {
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuth()
    const { activeFilter, setActiveFilter } = useCommunityFilter()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [allPosts, setAllPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [likedPostIds, setLikedPostIds] = useState<string[]>([])
    const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>([])
    const [sortType, setSortType] = useState<PostSortType>('latest')

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await getPosts(sortType, activeFilter)
                console.log('community page post', posts)
                setAllPosts(posts)
            } catch (error) {
                console.error('불러오기 실패:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [sortType, activeFilter])

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!user) {
                setBookmarkedPostIds([])
                return
            }

            const { data, error } = await supabase.from('bookmarks').select('post_id').eq('user_id', user.id)

            if (error) {
                console.error('북마크 목록 조회 실패:', error)
                return
            }

            const ids = (data ?? []).map((item) => item.post_id).filter((id): id is string => Boolean(id))

            setBookmarkedPostIds(ids)
        }

        fetchBookmarks()
    }, [user])

    useEffect(() => {
        const fetchLikes = async () => {
            if (!user) {
                setLikedPostIds([])
                return
            }
            const { data, error } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id)
            if (error) {
                console.error('좋아요 목록 조회 실패:', error)
                return
            }
            const ids = (data ?? []).map((item) => item.post_id).filter((id): id is string => Boolean(id))
            setLikedPostIds(ids)
        }
        fetchLikes()
    }, [user])

    // const filteredPosts =
    //     activeFilter === 'ALL' ? allPosts : allPosts.filter((post) => post.travel_type === activeFilter)

    const handleLikeClick = async (postId: string) => {
        if (!isAuthenticated || !user?.id) {
            setIsLoginModalOpen(true)
            return
        }
        const isLiked = await toggleLike(postId, user.id)
        setLikedPostIds((prev) => (isLiked ? [...prev, postId] : prev.filter((id) => id !== postId)))
        setAllPosts((prev) =>
            prev.map((post) =>
                post.id === postId ? { ...post, like_count: post.like_count + (isLiked ? 1 : -1) } : post,
            ),
        )
    }

    const handleBookmarkClick = async (postId: string) => {
        if (!isAuthenticated) {
            setIsLoginModalOpen(true)
            return
        }

        if (!user) return

        const targetPost = allPosts.find((post) => post.id === postId)
        if (!targetPost) return

        const isBookmarked = bookmarkedPostIds.includes(postId)

        try {
            if (isBookmarked) {
                const { error } = await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', postId)

                if (error) {
                    console.error('북마크 삭제 실패:', error)
                    alert('북마크 삭제 실패')
                    return
                }

                setBookmarkedPostIds((prev) => prev.filter((id) => id !== postId))
                return
            }

            const { error } = await supabase.from('bookmarks').insert({
                user_id: user.id,
                post_id: postId,
                place_name: targetPost.title,
            })

            if (error) {
                console.error('북마크 저장 실패:', error)
                alert('북마크 저장 실패')
                return
            }

            setBookmarkedPostIds((prev) => [...prev, postId])
        } catch (error) {
            console.error('북마크 처리 실패:', error)
        }
    }

    const handleWriteClick = () => {
        if (isAuthenticated) {
            navigate('/create-post')
        } else {
            setIsLoginModalOpen(true)
        }
    }

    const handlePostClick = (postId: string) => {
        if (!isAuthenticated) {
            setIsLoginModalOpen(true)
            return
        }
        navigate(`/community/${postId}`)
    }

    if (isLoading) {
        return (
            <div className="min-h-full bg-background flex items-center justify-center">
                <p className="text-text-muted">불러오는 중...</p>
            </div>
        )
    }

    return (
        <div className="min-h-full bg-background pb-24 pt-6 relative">
            <div className="px-6 mb-6">
                <h1 className="text-2xl font-bold text-text mb-1">여행자 커뮤니티</h1>
                <p className="text-sm text-text-muted">다른 여행러들의 이야기를 만나보세요</p>
            </div>

            <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            <div className="px-6 flex justify-end mb-4">
                <SortDropdown activeSort={sortType} onSortChange={setSortType} />
            </div>

            <PostFeed
                posts={allPosts}
                likedPostIds={likedPostIds}
                bookmarkedPostIds={bookmarkedPostIds}
                onLikeClick={handleLikeClick}
                onBookmarkClick={handleBookmarkClick}
                onPostClick={handlePostClick}
            />

            {isAuthenticated && <WriteButton onClick={handleWriteClick} />}

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onConfirm={() => {
                    setIsLoginModalOpen(false)
                    navigate('/login', {
                        state: { from: '/community' },
                    })
                }}
            />
        </div>
    )
}
