import { ChevronLeftIcon, HomeIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CommentInput } from '../components/commentInput'
import { CommentList } from '../components/commentList'
import { PostContent } from '../components/postContent'
import { useDetailPost } from '../hooks/useDetailPost'

export const DetailPostPage: React.FC = () => {
    const navigate = useNavigate()
    const handleGoBack = () => {
        navigate('/community')
    }
    const {
        post,
        isLoading,
        comment,
        localComments,
        isLiked,
        isBookmarked,
        currentUserId,
        editingCommentId,
        editingCommentContent,
        setComment,
        setEditingCommentContent,
        canEditComment,
        handleEditPost,
        handleDeletePost,
        handleLikeClick,
        handleBookmarkClick,
        handleCommentSubmit,
        handleEditStart,
        handleEditCancel,
        handleEditSave,
        handleDelete,
    } = useDetailPost()

    if (isLoading) {
        return (
            <div className="min-h-full bg-background pb-24 pt-6 relative">
                <div className="px-6 mb-6">
                    <h1 className="text-2xl font-bold text-text mb-1">로딩 중...</h1>
                </div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-full bg-background pb-24 pt-6 relative">
                <div className="px-6 mb-6">
                    <h1 className="text-2xl font-bold text-text mb-1">게시물을 찾을 수 없습니다.</h1>
                    <p className="text-sm text-text-muted">존재하지 않는 게시물입니다.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 -mr-2 text-text-muted hover:text-text transition-colors"
                    >
                        <HomeIcon className="w-6 h-6" />
                    </button>
                </div>
                <PostContent
                    post={post}
                    isLiked={isLiked}
                    isBookmarked={isBookmarked}
                    currentUserId={currentUserId}
                    commentCount={localComments.length}
                    onEditPost={handleEditPost}
                    onLikeClick={handleLikeClick}
                    onBookmarkClick={handleBookmarkClick}
                    onDeletePost={handleDeletePost}
                />
                <CommentList
                    comments={localComments}
                    editingCommentId={editingCommentId}
                    editingCommentContent={editingCommentContent}
                    canEditComment={canEditComment}
                    onCommentEditStart={handleEditStart}
                    onCommentEditCancel={handleEditCancel}
                    onCommentEditSave={handleEditSave}
                    onEditContentChange={setEditingCommentContent}
                    onCommentDelete={handleDelete}
                />
            </div>
            <CommentInput comment={comment} onCommentChange={setComment} onSubmit={handleCommentSubmit} />
        </div>
    )
}
