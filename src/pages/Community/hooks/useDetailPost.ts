import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import { getComments, getPostById, Post, saveComment, toggleBookmark, toggleLike } from '../../../services/testPostApi'
import { LocalComment } from '../types/comment'
import { useCommentEditor } from './useCommentEditor'

const convertComments = (data: any[]): LocalComment[] =>
    data.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.created_at,
        userId: c.user_id,
        author: {
            nickname: c.nickname || '익명',
            avatar: c.avatar_url || '',
        },
    }))

export const useDetailPost = () => {
    const { postId } = useParams<{ postId: string }>()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [comment, setComment] = useState('')
    const [localComments, setLocalComments] = useState<LocalComment[]>([])
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    const commentEditor = useCommentEditor(setLocalComments, postId)

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return
            try {
                const data = await getPostById(postId)
                setPost(data)
            } catch (error) {
                console.error('게시물 불러오기 실패:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPost()
    }, [postId])

    useEffect(() => {
        const fetchComments = async () => {
            if (!postId) return
            const data = await getComments(postId)
            setLocalComments(convertComments(data))
        }
        fetchComments()
    }, [postId])

    useEffect(() => {
        const fetchUserActions = async () => {
            if (!user?.id || !postId) return
            const [likeResult, bookmarkResult] = await Promise.all([
                supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).maybeSingle(),
                supabase.from('bookmarks').select('id').eq('post_id', postId).eq('user_id', user.id).maybeSingle(),
            ])
            setIsLiked(!!likeResult.data)
            setIsBookmarked(!!bookmarkResult.data)
        }
        fetchUserActions()
    }, [user?.id, postId])

    const handleEditPost = async (title: string, content: string, imageUrl: string) => {
        if (!postId) return
        const { error } = await supabase.from('posts').update({ title, content, image_url: imageUrl }).eq('id', postId)
        if (!error) {
            setPost((prev) => (prev ? { ...prev, title, content, image_url: imageUrl } : prev))
        }
    }

    const handleDeletePost = async () => {
        if (!postId) return
        const confirmed = window.confirm('게시물을 삭제하시겠습니까?')
        if (!confirmed) return
        const { error } = await supabase.from('posts').delete().eq('id', postId)
        if (!error) navigate('/community')
    }

    const handleLikeClick = async () => {
        if (!user?.id || !postId) return
        try {
            const liked = await toggleLike(postId, user.id)
            setIsLiked(liked)
            setPost((prev) => (prev ? { ...prev, like_count: prev.like_count + (liked ? 1 : -1) } : prev))
        } catch (error) {
            console.error('좋아요 실패:', error)
        }
    }

    const handleBookmarkClick = async () => {
        if (!user?.id || !postId) return
        try {
            const bookmarked = await toggleBookmark(postId, user.id)
            setIsBookmarked(bookmarked)
        } catch (error) {
            console.error('북마크 실패:', error)
        }
    }

    const handleCommentSubmit = async () => {
        if (!comment.trim() || !user?.id || !postId) return
        try {
            await saveComment(postId, user.id, comment)
            setComment('')
            const data = await getComments(postId)
            setLocalComments(convertComments(data))
        } catch (error) {
            console.error('댓글 저장 실패:', error)
        }
    }

    const canEditComment = (c: LocalComment) =>
        !!user?.id && !!post && (user.id === c.userId || user.id === post.user_id)

    // 게시글 댓글 좋아요 북마크 상태관리, 게시글 수정 삭제 핸들러
    return {
        // 상태
        post,
        isLoading,
        comment,
        localComments,
        isLiked,
        isBookmarked,
        currentUserId: user?.id ?? null,
        // 액션
        setComment,
        canEditComment,
        handleEditPost,
        handleDeletePost,
        handleLikeClick,
        handleBookmarkClick,
        handleCommentSubmit,
        // 댓글 편집
        ...commentEditor,
    }
}
