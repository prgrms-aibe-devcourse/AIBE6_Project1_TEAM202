import {
    BookmarkIcon,
    CheckIcon,
    ChevronLeftIcon,
    HeartIcon,
    ImageIcon,
    MessageCircleIcon,
    PencilIcon,
    TrashIcon,
    XIcon,
} from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { resultTypes } from '../../../data/mockData'
import { Post } from '../../../services/testPostApi'
import { usePostEdit } from '../hooks/usePostEdit'

interface PostContentProps {
    post: Post
    isLiked: boolean
    isBookmarked: boolean
    currentUserId?: string | null
    commentCount: number
    editedImageFile?: File | null
    editedImagePreview?: string | null
    onLikeClick: (e: React.MouseEvent) => void
    onBookmarkClick: (e: React.MouseEvent) => void
    onEditPost?: (title: string, content: string, image_url: string) => Promise<void>
    onDeletePost?: () => Promise<void>
}

export const PostContent: React.FC<PostContentProps> = ({
    post,
    isLiked,
    isBookmarked,
    currentUserId,
    commentCount,
    editedImagePreview,
    onLikeClick,
    onBookmarkClick,
    onEditPost,
    onDeletePost,
}) => {
    const navigate = useNavigate()
    const travelTypeInfo = resultTypes[post.travel_type as keyof typeof resultTypes]
    const isAuthor = !!currentUserId && currentUserId === post.user_id

    // 게시물 Edit 커스텀 훅 호출
    const {
        isEditing,
        editedTitle,
        editedContent,
        isSaving,
        setIsEditing,
        setEditedTitle,
        setEditedContent,
        handleSave,
        handleCancel,
        handleImageChange,
    } = usePostEdit(post, onEditPost)

    const handleGoBack = () => {
        navigate('/community')
    }

    return (
        <div>
            {/* 뒤로가기 버튼 */}
            <div className="mb-4">
                <button
                    onClick={handleGoBack}
                    className="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                    뒤로가기
                </button>
            </div>
            {/* 작성자 영역 버튼 분리 */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        {post.author?.avatar_url ? (
                            <img
                                src={post.author.avatar_url}
                                alt={post.author.nickname}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                                {travelTypeInfo?.emoji ?? '✈️'}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-text text-sm">
                            {post.author?.nickname ?? '알 수 없는 사용자'}
                        </div>
                        <div className="text-xs text-text-muted flex items-center gap-1">
                            <span>{travelTypeInfo?.emoji}</span>
                            {travelTypeInfo?.title}
                        </div>
                    </div>
                </div>

                {isAuthor && !isEditing && (
                    <div className="flex gap-2">
                        <button
                            onClick={onDeletePost}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 text-sm text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                            <TrashIcon className="w-3.5 h-3.5" />
                            삭제
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary"
                        >
                            <PencilIcon className="w-3.5 h-3.5" />
                            수정
                        </button>
                    </div>
                )}
            </div>

            {/* 게시글 제목 */}
            {isEditing ? (
                <input
                    className="w-full text-2xl font-bold text-text mb-3 border-b-2 border-primary outline-none bg-transparent"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                />
            ) : (
                <h1 className="text-2xl font-bold text-text mb-4">{post.title}</h1>
            )}

            {/* 이미지 */}
            {isEditing ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 mb-6">
                    {editedImagePreview && (
                        <img src={editedImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    {/* 이미지 위에 반투명 오버레이로 교체 버튼 표시 */}
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 cursor-pointer hover:bg-black/50 transition-colors">
                        <ImageIcon className="w-8 h-8 text-white mb-1" />
                        <span className="text-white text-sm font-medium">이미지 교체</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                </div>
            ) : (
                post.image_url && (
                    <div className="rounded-2xl overflow-hidden mb-6 bg-gray-100">
                        <img src={post.image_url} alt="게시글 이미지" className="w-full h-auto object-cover" />
                    </div>
                )
            )}

            {/* 게시글 내용 */}
            {isEditing ? (
                <textarea
                    className="w-full text-text leading-relaxed mb-4 border border-gray-200 rounded-xl p-3 outline-none focus:border-primary resize-none bg-transparent min-h-[120px]"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
            ) : (
                <p className="text-text leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>
            )}

            {/* 게시글 수정 완료 버튼 */}
            {isEditing && (
                <div className="flex gap-2 mb-6 justify-end">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm text-text-muted hover:bg-gray-50 transition-colors"
                    >
                        <XIcon className="w-4 h-4" />
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-sm hover:opacity-90 disabled:opacity-50"
                    >
                        <CheckIcon className="w-4 h-4" />
                        {isSaving ? '저장 중...' : '저장'}
                    </button>
                </div>
            )}

            {/* 하단 인터랙션 바 */}
            <div className="flex items-center justify-between py-4 border-y border-gray-100">
                <div className="flex gap-6">
                    <button
                        onClick={onLikeClick}
                        className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-primary' : 'text-text hover:text-primary'}`}
                    >
                        <HeartIcon className={`w-6 h-6 ${isLiked ? 'fill-primary' : ''}`} />
                        <span className="font-medium">{post.like_count}</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-text">
                        <MessageCircleIcon className="w-6 h-6" />
                        <span className="font-medium">{commentCount}</span>
                    </div>
                </div>
                <button
                    onClick={onBookmarkClick}
                    className={`transition-colors ${isBookmarked ? 'text-primary' : 'text-text hover:text-primary'}`}
                >
                    <BookmarkIcon className={`w-6 h-6 ${isBookmarked ? 'fill-primary' : ''}`} />
                </button>
            </div>
        </div>
    )
}
