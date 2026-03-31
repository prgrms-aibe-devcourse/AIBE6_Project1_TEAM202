import React, { useState } from 'react'
import { Post, uploadPostImage } from '../../../services/testPostApi'

export const usePostEdit = (
    post: Post,
    onEditPost?: (title: string, content: string, imageUrl: string) => Promise<void>,
) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editedTitle, setEditedTitle] = useState(post.title)
    const [editedContent, setEditedContent] = useState(post.content)
    const [isSaving, setIsSaving] = useState(false)

    const [editedImageFile, setEditedImageFile] = useState<File | null>(null)
    const [editedImagePreview, setEditedImagePreview] = useState<string | null>(post.image_url ?? null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setEditedImageFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setEditedImagePreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        if (!editedTitle.trim() || !editedContent.trim()) return
        setIsSaving(true)
        try {
            // 새 이미지가 있으면 업로드, 없으면 기존 URL 유지
            const imageUrl = editedImageFile ? await uploadPostImage(editedImageFile) : (post.image_url ?? '')
            await onEditPost?.(editedTitle.trim(), editedContent.trim(), imageUrl)
            setIsEditing(false)
            setEditedImageFile(null)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setEditedTitle(post.title)
        setEditedContent(post.content)
        setEditedImageFile(null)
        setEditedImagePreview(post.image_url ?? null)
        setIsEditing(false)
    }

    // 게시물 수정 커스텀 훅
    return {
        isEditing,
        editedTitle,
        editedContent,
        isSaving,
        editedImageFile,
        editedImagePreview,
        setIsEditing,
        setEditedTitle,
        setEditedContent,
        handleImageChange,
        handleSave,
        handleCancel,
    }
}
