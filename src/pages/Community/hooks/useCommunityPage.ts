import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import { getPosts, Post, PostSortType, toggleBookmark, toggleLike } from '../../../services/testPostApi'
import { useCommunityFilter } from './useCommunityFilter'

export const useCommunityPage = () => {
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuth()
    const { activeFilter, setActiveFilter } = useCommunityFilter()

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [allPosts, setAllPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [likedPostIds, setLikedPostIds] = useState<string[]>([])
    const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>([])
    const [sortType, setSortType] = useState<PostSortType>('latest')

    const [fetchTrigger] = useState(() => Date.now())

    useEffect(() => {
        let cancelled = false
        const fetchPosts = async () => {
            setIsLoading(true)
            try {
                const posts = await getPosts(sortType, activeFilter)
                if (!cancelled) setAllPosts(posts)
            } catch (error) {
                console.error('불러오기 실패:', error)
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }
        fetchPosts()
        return () => {
            cancelled = true
        }
    }, [sortType, activeFilter, fetchTrigger])

    // 좋아요, 북마크 상태변화 통합
    useEffect(() => {
        const fetchUserActions = async () => {
            if (!user) {
                setLikedPostIds([])
                setBookmarkedPostIds([])
                return
            }

            const [likesResult, bookmarksResult] = await Promise.all([
                supabase.from('post_likes').select('post_id').eq('user_id', user.id),
                supabase.from('bookmarks').select('post_id').eq('user_id', user.id),
            ])

            if (!likesResult.error) {
                setLikedPostIds(
                    (likesResult.data ?? []).map((item) => item.post_id).filter((id): id is string => Boolean(id)),
                )
            }

            if (!bookmarksResult.error) {
                setBookmarkedPostIds(
                    (bookmarksResult.data ?? []).map((item) => item.post_id).filter((id): id is string => Boolean(id)),
                )
            }
        }

        fetchUserActions()
    }, [user])

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

    // 북마크 supabase 직접 호출
    const handleBookmarkClick = async (postId: string) => {
        if (!isAuthenticated || !user?.id) {
            setIsLoginModalOpen(true)
            return
        }
        try {
            const isBookmarked = await toggleBookmark(postId, user.id)
            setBookmarkedPostIds((prev) => (isBookmarked ? [...prev, postId] : prev.filter((id) => id !== postId)))
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

    const handleLoginConfirm = () => {
        setIsLoginModalOpen(false)
        navigate('/login', { state: { from: '/community' } })
    }

    // 게시물 불러오기, 좋아요 북마크 상태관리, 글쓰기 클릭 로그인 모달 핸들러
    return {
        // 상태
        isLoading,
        allPosts,
        likedPostIds,
        bookmarkedPostIds,
        sortType,
        activeFilter,
        isLoginModalOpen,
        isAuthenticated,
        // 액션
        setSortType,
        setActiveFilter,
        setIsLoginModalOpen,
        handleLikeClick,
        handleBookmarkClick,
        handleWriteClick,
        handlePostClick,
        handleLoginConfirm,
    }
}
