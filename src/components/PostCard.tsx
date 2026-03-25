import { BookmarkIcon, HeartIcon, MessageCircleIcon } from 'lucide-react'
import React from 'react'
import { Post, resultTypes } from '../data/mockData'
import { Card } from './ui/Card'
interface PostCardProps {
    post: Post
    onLikeClick?: () => void
    onBookmarkClick?: () => void
}
export const PostCard: React.FC<PostCardProps> = ({ post, onLikeClick, onBookmarkClick }) => {
    const travelTypeInfo = resultTypes[post.type]
    return (
        <Card hoverable className="overflow-hidden bg-white border border-gray-50">
            {/* Author Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={post.author.avatar}
                        alt={post.author.nickname}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />

                    <div>
                        <div className="font-bold text-text text-sm">{post.author.nickname}</div>
                        <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-text-muted inline-flex items-center gap-1 mt-0.5">
                            <span>{travelTypeInfo.emoji}</span>
                            {travelTypeInfo.title.split(' ')[0]}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image */}
            <div className="aspect-square w-full bg-gray-100 relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Actions */}
            <div className="px-4 pt-4 pb-2 flex justify-between items-center">
                <div className="flex gap-4">
                    <button
                        onClick={onLikeClick}
                        className={`flex items-center gap-1.5 transition-colors ${post.isLiked ? 'text-primary' : 'text-text hover:text-primary'}`}
                    >
                        <HeartIcon className={`w-6 h-6 ${post.isLiked ? 'fill-primary' : ''}`} />

                        <span className="text-sm font-medium">{post.likeCount}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-text hover:text-primary transition-colors">
                        <MessageCircleIcon className="w-6 h-6" />
                        <span className="text-sm font-medium">{post.commentCount}</span>
                    </button>
                </div>
                <button
                    onClick={onBookmarkClick}
                    className={`transition-colors ${post.isBookmarked ? 'text-primary' : 'text-text hover:text-primary'}`}
                >
                    <BookmarkIcon className={`w-6 h-6 ${post.isBookmarked ? 'fill-primary' : ''}`} />
                </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-5">
                <h4 className="font-bold text-text text-sm mb-1 line-clamp-1">{post.title}</h4>
                <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">{post.content}</p>
            </div>
        </Card>
    )
}
