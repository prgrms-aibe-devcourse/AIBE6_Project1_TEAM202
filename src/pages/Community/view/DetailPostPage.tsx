import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import {
    Comment,
    getComments,
    getPostById,
    Post,
    saveComment,
    toggleBookmark,
    toggleLike,
} from '../../../services/testPostApi'
import { CommentInput } from '../components/commentInput'
import { CommentList } from '../components/commentList'
import { PostContent } from '../components/postContent'

interface LocalComment {
    id: string
    content: string
    createdAt: string
    userId: string // 댓글 수정을 위한 userId 추가
    author: {
        nickname: string
        avatar: string
    }
}

export const DetailPostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>()
    const { user } = useAuth()
    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [comment, setComment] = useState('')
    const [localComments, setLocalComments] = useState<LocalComment[]>([])
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    // 게시물 수정 관련 상태
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editingCommentContent, setEditingCommentContent] = useState('')

    // 게시물 삭제시 목록으로 이동
    const navigate = useNavigate()

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
            const converted: LocalComment[] = data.map((c: Comment) => ({
                id: c.id,
                content: c.content,
                createdAt: c.created_at,
                userId: c.user_id,
                author: {
                    nickname: c.nickname || '익명',
                    avatar: c.avatar_url || '',
                },
            }))
            setLocalComments(converted)
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

    // 게시물 수정 핸들러
    const handleEditPost = async (title: string, content: string) => {
        if (!postId) return
        const { error } = await supabase.from('posts').update({ title, content }).eq('id', postId)
        if (!error) {
            setPost((prev) => (prev ? { ...prev, title, content } : prev))
        }
    }

    // 게시물 삭제 핸들러
    const handleDeletePost = async () => {
        if (!postId) return
        const confirmed = window.confirm('게시물을 삭제하시겠습니까?')
        if (!confirmed) return
        const { error } = await supabase.from('posts').delete().eq('id', postId)
        if (!error) {
            navigate('/community')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-full bg-background pb-24 pt-6 relative">
                <div className="px-6 mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-text mb-1">로딩 중...</h1>
                    </div>
                </div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-full bg-background pb-24 pt-6 relative">
                <div className="px-6 mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-text mb-1">게시물을 찾을 수 없습니다.</h1>
                        <p className="text-sm text-text-muted">존재하지 않는 게시물입니다.</p>
                    </div>
                </div>
            </div>
        )
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
            const converted: LocalComment[] = data.map((c: Comment) => ({
                id: c.id,
                content: c.content,
                createdAt: c.created_at,
                userId: c.user_id,
                author: {
                    nickname: c.nickname || '익명',
                    avatar: c.avatar_url || '',
                },
            }))
            setLocalComments(converted)

            // comment_count 로컬 업데이트 추가
            setPost((prev) => (prev ? { ...prev, comment_count: prev.comment_count + 1 } : prev))
        } catch (error) {
            console.error('댓글 저장 실패:', error)
        }
    }

    const canEditComment = (comment: LocalComment) =>
        !!user?.id && (user.id === comment.userId || user.id === post.user_id)

    const handleCommentEditStart = (comment: LocalComment) => {
        setEditingCommentId(comment.id)
        setEditingCommentContent(comment.content)
    }

    const handleCommentEditCancel = () => {
        setEditingCommentId(null)
        setEditingCommentContent('')
    }

    const handleCommentEditSave = async (commentId: string) => {
        if (!editingCommentContent.trim()) return
        const { error } = await supabase
            .from('comments')
            .update({ content: editingCommentContent.trim() })
            .eq('id', commentId)

        if (error) {
            console.error('댓글 수정 실패:', error)
            return
        }

        setLocalComments((prev) =>
            prev.map((c) => (c.id === commentId ? { ...c, content: editingCommentContent.trim() } : c)),
        )
        setEditingCommentId(null)
        setEditingCommentContent('')
    }

    const handleCommentDelete = async (commentId: string) => {
        const confirmed = window.confirm('댓글을 삭제하시겠습니까?')
        if (!confirmed) return
        const { error } = await supabase.from('comments').delete().eq('id', commentId)
        if (!error) {
            setLocalComments((prev) => prev.filter((c) => c.id !== commentId))
            setPost((prev) => (prev ? { ...prev, comment_count: prev.comment_count - 1 } : prev))
        }
    }

    return (
        <div>
            <div className="p-6">
                <PostContent
                    post={post}
                    isLiked={isLiked}
                    isBookmarked={isBookmarked}
                    currentUserId={user?.id ?? null}
                    onEditPost={handleEditPost}
                    onLikeClick={handleLikeClick}
                    onBookmarkClick={handleBookmarkClick}
                    onDeletePost={handleDeletePost}
                />
                <CommentList
                    comments={localComments}
                    commentCount={localComments.length}
                    editingCommentId={editingCommentId}
                    editingCommentContent={editingCommentContent}
                    canEditComment={canEditComment}
                    onCommentEditStart={handleCommentEditStart}
                    onCommentEditCancel={handleCommentEditCancel}
                    onCommentEditSave={handleCommentEditSave}
                    onEditContentChange={setEditingCommentContent}
                    onCommentDelete={handleCommentDelete}
                />
            </div>
            <CommentInput comment={comment} onCommentChange={setComment} onSubmit={handleCommentSubmit} />
        </div>
    )
}
