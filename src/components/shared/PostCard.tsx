import { BookmarkIcon, HeartIcon, MessageCircleIcon } from 'lucide-react'
import React from 'react'
import { resultTypes } from '../../data/mockData'
import { Post } from '../../services/testPostApi'
import { Card } from '../ui/Card'
interface PostCardProps {
    post: Post
    isLiked?: boolean
    isBookmarked?: boolean
    onLikeClick?: (e: React.MouseEvent) => void
    onBookmarkClick?: (e: React.MouseEvent) => void
}
export const PostCard: React.FC<PostCardProps> = ({ post, isLiked, isBookmarked, onLikeClick, onBookmarkClick }) => {
    const travelTypeInfo = resultTypes[post.travel_type as keyof typeof resultTypes]
    const author = post.author
    console.log('PostCard post:', post)
    console.log('PostCard author:', post.author)
    return (
        <Card hoverable className="overflow-hidden bg-white border border-gray-50">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {author?.avatar_url ? (
                            <img src={author.avatar_url} alt={author.nickname} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                                {travelTypeInfo?.emoji}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div className="font-bold text-text text-sm">{author?.nickname ?? '알 수 없는 사용자'}</div>
                        <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-text-muted inline-flex items-center gap-1 mt-0.5 w-fit">
                            <span>{travelTypeInfo?.emoji}</span>
                            {travelTypeInfo?.title.split(' ')[0]}
                        </div>
                    </div>
                </div>
            </div>

            {post.image_url && (
                <div className="aspect-square w-full bg-gray-100 relative">
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="px-4 pt-4 pb-2 flex justify-between items-center">
                <div className="flex gap-4">
                    {/* isLiked 적용 */}
                    <button
                        onClick={onLikeClick}
                        className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-primary' : 'text-text hover:text-primary'}`}
                    >
                        <HeartIcon className={`w-6 h-6 ${isLiked ? 'fill-primary' : ''}`} />
                        <span className="text-sm font-medium">{post.like_count}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-text hover:text-primary transition-colors">
                        <MessageCircleIcon className="w-6 h-6" />
                        <span className="text-sm font-medium">{post.comment_count}</span>
                    </button>
                </div>
                {/* isBookmarked 적용 */}
                <button
                    onClick={onBookmarkClick}
                    className={`transition-colors ${isBookmarked ? 'text-primary' : 'text-text hover:text-primary'}`}
                >
                    <BookmarkIcon className={`w-6 h-6 ${isBookmarked ? 'fill-primary' : ''}`} />
                </button>
            </div>

            <div className="px-4 pb-5">
                <h4 className="font-bold text-text text-sm mb-1 line-clamp-1">{post.title}</h4>
                <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">{post.content}</p>
            </div>
        </Card>
    )
}
