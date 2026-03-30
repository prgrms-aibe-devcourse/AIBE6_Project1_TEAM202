import { CheckIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react'
import React from 'react'

interface Comment {
    id: string
    content: string
    createdAt: string
    userId: string
    author: {
        nickname: string
        avatar: string
    }
}

interface CommentListProps {
    comments: Comment[]
    commentCount: number
    editingCommentId: string | null
    editingCommentContent: string
    onCommentEditStart: (comment: Comment) => void
    onCommentEditCancel: () => void
    onCommentEditSave: (commentId: string) => void
    canEditComment: (comment: Comment) => boolean
    onEditContentChange: (content: string) => void
    onCommentDelete: (commentId: string) => void
}

export const CommentList: React.FC<CommentListProps> = ({
    comments,
    commentCount,
    editingCommentId,
    editingCommentContent,
    onCommentEditStart,
    onCommentEditCancel,
    onCommentEditSave,
    canEditComment,
    onEditContentChange,
    onCommentDelete,
}) => {
    return (
        <div className="px-6 py-6 bg-gray-50 min-h-[300px]">
            <h3 className="font-bold text-text mb-4">댓글 {commentCount}</h3>
            <div className="space-y-4">
                {comments.map((comment) => {
                    const isEditing = editingCommentId === comment.id
                    const canEdit = canEditComment(comment)

                    return (
                        <div key={comment.id} className="flex gap-3">
                            {comment.author.avatar ? (
                                <img
                                    src={comment.author.avatar}
                                    alt={comment.author.nickname}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs flex-shrink-0">
                                    {comment.author.nickname?.[0] ?? '?'}
                                </div>
                            )}

                            <div className="flex-1">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-bold text-gray-900">{comment.author.nickname}</p>
                                        {canEdit && !isEditing && (
                                            <button
                                                onClick={() => onCommentEditStart(comment)}
                                                className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-primary transition-colors"
                                            >
                                                <PencilIcon className="w-3 h-3" />
                                                수정
                                            </button>
                                        )}
                                    </div>

                                    {/* 내용 조건부 렌더링 */}
                                    {isEditing ? (
                                        <>
                                            <textarea
                                                className="w-full text-sm text-gray-700 border border-primary rounded-lg p-2 outline-none resize-none min-h-[60px]"
                                                value={editingCommentContent}
                                                onChange={(e) => onEditContentChange(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="flex gap-2 justify-end mt-2">
                                                <button
                                                    onClick={() => onCommentDelete?.(comment.id)}
                                                    className="flex items-center gap-1 px-3 py-1 rounded-full border border-red-200 text-xs text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                >
                                                    <TrashIcon className="w-3 h-3" />
                                                    삭제
                                                </button>
                                                <button
                                                    onClick={onCommentEditCancel}
                                                    className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-500 hover:bg-gray-50"
                                                >
                                                    <XIcon className="w-3 h-3" />
                                                    취소
                                                </button>
                                                <button
                                                    onClick={() => onCommentEditSave(comment.id)}
                                                    disabled={!editingCommentContent.trim()}
                                                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-white text-xs hover:opacity-90 disabled:opacity-40"
                                                >
                                                    <CheckIcon className="w-3 h-3" />
                                                    저장
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-700 leading-snug">{comment.content}</p>
                                    )}
                                </div>

                                <span className="text-[10px] text-gray-400 ml-1 mt-1 block">
                                    {new Date(comment.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
