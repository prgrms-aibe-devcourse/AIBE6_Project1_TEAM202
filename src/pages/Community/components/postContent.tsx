import { BookmarkIcon, CheckIcon, HeartIcon, MessageCircleIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { resultTypes } from '../../../data/mockData'
import { Post } from '../../../services/testPostApi'

interface PostContentProps {
    post: Post
    isLiked: boolean
    isBookmarked: boolean
    currentUserId?: string | null
    onLikeClick: (e: React.MouseEvent) => void
    onBookmarkClick: (e: React.MouseEvent) => void
    onEditPost?: (title: string, content: string) => Promise<void>
    onDeletePost?: () => Promise<void>
}

export const PostContent: React.FC<PostContentProps> = ({
    post,
    isLiked,
    isBookmarked,
    currentUserId,
    onLikeClick,
    onBookmarkClick,
    onEditPost,
    onDeletePost,
}) => {
    const travelTypeInfo = resultTypes[post.travel_type as keyof typeof resultTypes]

    const isAuthor = !!currentUserId && currentUserId === post.user_id
    const [isEditing, setIsEditing] = useState(false)
    const [editedTitle, setEditedTitle] = useState(post.title)
    const [editedContent, setEditedContent] = useState(post.content)
    const [isSaving, setIsSaving] = useState(false)

    const handleEditSave = async () => {
        if (!editedTitle.trim() || !editedContent.trim()) return
        setIsSaving(true)
        try {
            await onEditPost?.(editedTitle.trim(), editedContent.trim())
            setIsEditing(false)
        } finally {
            setIsSaving(false)
        }
    }

    const handleEditCancel = () => {
        setEditedTitle(post.title)
        setEditedContent(post.content)
        setIsEditing(false)
    }

    return (
        <div>
            {/* 작성자 정보 */}
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
                    <div className="font-bold text-text text-sm">{post.author?.nickname ?? '알 수 없는 사용자'}</div>
                    <div>
                        <div className="text-xs text-text-muted flex items-center gap-1">
                            <span>{travelTypeInfo?.emoji}</span>
                            {travelTypeInfo?.title}
                        </div>
                    </div>
                    {isAuthor && !isEditing && (
                        <div className="flex gap-2 mb-6 justify-between">
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
            </div>

            {/* 게시글 제목 - 조건부 렌더링 */}
            {isEditing ? (
                <input
                    className="w-full text-2xl font-bold text-text mb-3 border-b-2 border-primary outline-none bg-transparent"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                />
            ) : (
                <h1 className="text-2xl font-bold text-text mb-4">{post.title}</h1>
            )}

            {/* 이미지 영역 */}
            {post.image_url && (
                <div className="rounded-2xl overflow-hidden mb-6 bg-gray-100">
                    <img src={post.image_url} alt="게시글 이미지" className="w-full h-auto object-cover" />
                </div>
            )}

            {/* 게시글 내용 - 조건부 렌더링 */}
            {isEditing ? (
                <textarea
                    className="w-full text-text leading-relaxed mb-4 border border-gray-200 rounded-xl p-3 outline-none focus:border-primary resize-none bg-transparent min-h-[120px]"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
            ) : (
                <p className="text-text leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>
            )}

            {isEditing && (
                <div className="flex gap-2 mb-6 justify-end">
                    <button
                        onClick={handleEditCancel}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm text-text-muted hover:bg-gray-50 transition-colors"
                    >
                        <XIcon className="w-4 h-4" />
                        취소
                    </button>
                    <button
                        onClick={handleEditSave}
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
                    <div className="flex items-center gap-1.5 text-text">
                        <button
                            onClick={onLikeClick}
                            className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-primary' : 'text-text hover:text-primary'}`}
                        >
                            <HeartIcon className={`w-6 h-6 ${isLiked ? 'fill-primary' : ''}`} />
                            <span className="font-medium">{post.like_count}</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-text">
                        <MessageCircleIcon className="w-6 h-6" />
                        <span className="font-medium">{post.comment_count}</span>
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
