import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { mockUsers, User } from '../data/mockData'
interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (email: string) => void
    signup: (email: string, nickname: string) => void
    logout: () => void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const AuthProvider: React.FC<{
    children: ReactNode
}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const storedUser = localStorage.getItem('poomang_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])
    const login = (email: string) => {
        // Mock login: find user or use default
        const foundUser = mockUsers.find((u) => u.email === email) || mockUsers[0]
        setUser(foundUser)
        localStorage.setItem('poomang_user', JSON.stringify(foundUser))
    }
    const signup = (email: string, nickname: string) => {
        // Mock signup: create new user
        const newUser: User = {
            id: `u_${Date.now()}`,
            email,
            nickname,
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
            travelType: 'HEALING',
            createdAt: new Date().toISOString(),
        }
        setUser(newUser)
        localStorage.setItem('poomang_user', JSON.stringify(newUser))
    }
    const logout = () => {
        setUser(null)
        localStorage.removeItem('poomang_user')
    }
    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
