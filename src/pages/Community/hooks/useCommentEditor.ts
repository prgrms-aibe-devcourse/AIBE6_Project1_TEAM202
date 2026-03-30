import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { LocalComment } from '../types/comment'

export const useCommentEditor = (
    setLocalComments: React.Dispatch<React.SetStateAction<LocalComment[]>>,
    postId: string | undefined,
) => {
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editingCommentContent, setEditingCommentContent] = useState('')

    const handleEditStart = (comment: LocalComment) => {
        setEditingCommentId(comment.id)
        setEditingCommentContent(comment.content)
    }

    const handleEditCancel = () => {
        setEditingCommentId(null)
        setEditingCommentContent('')
    }

    const handleEditSave = async (commentId: string) => {
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

    const handleDelete = async (commentId: string) => {
        const confirmed = window.confirm('댓글을 삭제하시겠습니까?')
        if (!confirmed) return

        const { error } = await supabase.from('comments').delete().eq('id', commentId)
        if (!error) {
            setLocalComments((prev) => prev.filter((c) => c.id !== commentId))
            if (postId) {
                await supabase.rpc('decrement_comment_count', { post_id: postId })
            }
        }
    }

    // 댓글 편집 커스텀 훅
    return {
        editingCommentId,
        editingCommentContent,
        setEditingCommentContent,
        handleEditStart,
        handleEditCancel,
        handleEditSave,
        handleDelete,
    }
}
