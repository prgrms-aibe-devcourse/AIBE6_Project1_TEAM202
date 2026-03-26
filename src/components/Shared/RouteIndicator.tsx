import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const RouteIndicator: React.FC = () => {
    const location = useLocation()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        const timer = setTimeout(() => {
            setLoading(false)
        }, 400)

        return () => clearTimeout(timer)
    }, [location.pathname])

    if (!loading) return null

    return (
        <div className="absolute left-0 top-0 z-[100] h-1 w-full overflow-hidden bg-transparent">
            <div className="h-full w-1/3 animate-[loadingBar_1s_ease-in-out_infinite] rounded-r-full bg-primary" />
        </div>
    )
}
