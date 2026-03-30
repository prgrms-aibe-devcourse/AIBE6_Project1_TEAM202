import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { TravelType } from '../../../data/mockData'
import { savePost, uploadPostImage } from '../../../services/testPostApi'

export const useCreatePost = () => {
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuth()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [selectedType, setSelectedType] = useState<TravelType>('HEALING')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const handleImageRemove = () => {
        setImagePreview(null)
        setImageFile(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !content || !imageFile) return
        try {
            const image_url = await uploadPostImage(imageFile)
            await savePost({
                title,
                content,
                image_url,
                travel_type: selectedType,
                user_id: user?.id,
            })
            navigate('/community')
        } catch (error) {
            console.error('저장 실패:', error)
        }
    }

    // 폼 상태 관리, 게시글 업로드 처리 핸들러
    return {
        // 상태
        title,
        content,
        selectedType,
        imagePreview,
        imageFile,
        // 액션
        setTitle,
        setContent,
        setSelectedType,
        handleImageChange,
        handleImageRemove,
        handleSubmit,
    }
}
