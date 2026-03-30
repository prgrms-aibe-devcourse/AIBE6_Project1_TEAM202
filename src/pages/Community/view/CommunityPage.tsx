import React from 'react'
import { FilterBar } from '../components/filterBar'
import { LoginModal } from '../components/LoginModal'
import { PostFeed } from '../components/postFeed'
import { SortDropdown } from '../components/SortDropdown'
import { WriteButton } from '../components/writeButton'
import { useCommunityPage } from '../hooks/useCommunityPage'

export const CommunityPage: React.FC = () => {
    const {
        isLoading,
        allPosts,
        likedPostIds,
        bookmarkedPostIds,
        sortType,
        activeFilter,
        isLoginModalOpen,
        isAuthenticated,
        setSortType,
        setActiveFilter,
        setIsLoginModalOpen,
        handleLikeClick,
        handleBookmarkClick,
        handleWriteClick,
        handlePostClick,
        handleLoginConfirm,
    } = useCommunityPage()

    if (isLoading) {
        return (
            <div className="min-h-full bg-background flex items-center justify-center">
                <p className="text-text-muted">불러오는 중...</p>
            </div>
        )
    }

    return (
        <div className="min-h-full bg-background pb-24 pt-6 relative">
            <div className="px-6 mb-6">
                <h1 className="text-2xl font-bold text-text mb-1">여행자 커뮤니티</h1>
                <p className="text-sm text-text-muted">다른 여행러들의 이야기를 만나보세요</p>
            </div>

            <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            <div className="px-6 flex justify-end mb-4">
                <SortDropdown activeSort={sortType} onSortChange={setSortType} />
            </div>

            <PostFeed
                posts={allPosts}
                likedPostIds={likedPostIds}
                bookmarkedPostIds={bookmarkedPostIds}
                onLikeClick={handleLikeClick}
                onBookmarkClick={handleBookmarkClick}
                onPostClick={handlePostClick}
            />

            {isAuthenticated && <WriteButton onClick={handleWriteClick} />}

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onConfirm={handleLoginConfirm}
            />
        </div>
    )
}
