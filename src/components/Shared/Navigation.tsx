import { CompassIcon, HomeIcon, UserIcon, UsersIcon } from 'lucide-react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
export const BottomNav: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, isAuthenticated } = useAuth()
    // Hide nav on specific pages
    const hiddenPaths = ['/test', '/login', '/signup', '/create-post']
    if (hiddenPaths.some((path) => location.pathname.startsWith(path))) return null
    const navItems = [
        {
            path: '/',
            icon: HomeIcon,
            label: '홈',
        },
        {
            path: '/test',
            icon: CompassIcon,
            label: '테스트',
        },
        {
            path: '/community',
            icon: UsersIcon,
            label: '커뮤니티',
        },
        {
            path: '/my',
            icon: UserIcon,
            label: '마이',
        },
    ]

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 pb-safe flex justify-around items-center z-50">
            {navItems.map((item) => {
                const isActive =
                    location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                // Custom render for My Page avatar
                if (item.path === '/my' && isAuthenticated && user) {
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="flex flex-col items-center p-2 transition-colors"
                        >
                            <div
                                className={`w-6 h-6 mb-1 rounded-full overflow-hidden border-2 transition-colors ${isActive ? 'border-primary' : 'border-transparent'}`}
                            >
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                                {item.label}
                            </span>
                        </button>
                    )
                }
                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center p-2 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-primary/20' : ''}`} />

                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
