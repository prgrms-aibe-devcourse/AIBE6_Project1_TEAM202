import React, { useEffect, useState } from 'react'

import { getTestCount } from '../../../services/testCountApi'
import { TestCountBadge } from './TestCountBadge'

export const TestCountContainer: React.FC = () => {
    const [testCount, setTestCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const data = await getTestCount()
                setTestCount(data.count)
            } catch (error) {
                console.error('테스트 참여 수 조회 실패', error)
                setIsError(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCount()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center gap-1 text-sm font-medium text-gray-400">
                <span>불러오는 중...</span>
            </div>
        )
    }

    if (isError) {
        return null
    }

    return <TestCountBadge count={testCount} />
}
