import { useState } from 'react'
import { Post } from '../../../services/testPostApi'

export const usePostEdit = (post: Post, onEditPost?: (title: string, content: string) => Promise<void>) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editedTitle, setEditedTitle] = useState(post.title)
    const [editedContent, setEditedContent] = useState(post.content)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (!editedTitle.trim() || !editedContent.trim()) return
        setIsSaving(true)
        try {
            await onEditPost?.(editedTitle.trim(), editedContent.trim())
            setIsEditing(false)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setEditedTitle(post.title)
        setEditedContent(post.content)
        setIsEditing(false)
    }

    // 게시물 수정 커스텀 훅
    return {
        isEditing,
        editedTitle,
        editedContent,
        isSaving,
        setIsEditing,
        setEditedTitle,
        setEditedContent,
        handleSave,
        handleCancel,
    }
}
