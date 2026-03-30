import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import type { PostSortType } from '../../../services/testPostApi'

interface SortDropdownProps {
    activeSort: PostSortType
    onSortChange: (sort: PostSortType) => void
}

const sortOptions: { id: PostSortType; label: string }[] = [
    { id: 'latest', label: '최신순' },
    { id: 'mostLiked', label: '좋아요 많은 순' },
    { id: 'mostCommented', label: '댓글 많은 순' },
]

export const SortDropdown: React.FC<SortDropdownProps> = ({ activeSort, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const activeLabel = sortOptions.find((option) => option.id === activeSort)?.label ?? '최신순'

    return (
        <div ref={wrapperRef} className="relative w-fit">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-3 py-2 text-sm font-medium text-text shadow-sm transition hover:bg-gray-50"
            >
                <span>{activeLabel}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[180px] overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-lg">
                    {sortOptions.map((option) => {
                        const isSelected = activeSort === option.id

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                    onSortChange(option.id)
                                    setIsOpen(false)
                                }}
                                className="flex w-full items-center justify-between px-4 py-3 text-sm text-text transition hover:bg-gray-50"
                            >
                                <span>{option.label}</span>
                                {isSelected && <CheckIcon className="h-4 w-4 text-primary" />}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
