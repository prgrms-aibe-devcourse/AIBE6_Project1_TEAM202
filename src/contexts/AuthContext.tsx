import type { Session, User } from '@supabase/supabase-js'
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'

// 인증 상태 전역 관리 Context
// - Supabase 세션 관리
// - 사용자 정보(user) 상태 유지
// - 로그인/로그아웃 처리
// - 최초 로그인 시 users 테이블 프로필 보정
interface AuthContextType {
    user: User | null
    session: Session | null
    isAuthenticated: boolean
    isLoading: boolean
    displayName: string
    profileImage: string | null
    loginWithKakao: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 사용자 메타데이터에서 displayName 추출
// (카카오 로그인 등 다양한 필드 대응)
const getDisplayName = (user: User | null) => {
    if (!user) return ''

    return (
        user.user_metadata?.nickname ||
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.user_name ||
        user.email?.split('@')[0] ||
        '사용자'
    )
}

const getProfileImage = (user: User | null) => {
    if (!user) return null

    return user.user_metadata?.avatar_url || user.user_metadata?.picture || user.user_metadata?.profile_image || null
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // 사용자 프로필을 DB(users 테이블)에 저장/업데이트
    // 이미 존재하면 무시 (중복 방지)
    const ensureUserProfile = async (user: User) => {
        const { error } = await supabase.from('users').upsert(
            {
                id: user.id,
                nickname:
                    user.user_metadata?.nickname ||
                    user.user_metadata?.name ||
                    user.user_metadata?.full_name ||
                    user.user_metadata?.user_name ||
                    user.email?.split('@')[0] ||
                    '사용자',
                avatar_url:
                    user.user_metadata?.avatar_url ||
                    user.user_metadata?.picture ||
                    user.user_metadata?.profile_image ||
                    null,
            },
            {
                onConflict: 'id',
                ignoreDuplicates: true,
            },
        )

        if (error) {
            console.error('users 프로필 보정 실패:', error)
        }
    }
    // 초기 앱 실행 시 세션 복원 + 유저 상태 설정
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setIsLoading(true)

                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession()

                if (error) {
                    console.error('세션 조회 실패:', error.message)
                }

                setSession(session)
                setUser(session?.user ?? null)
                setIsLoading(false)

                if (session?.user) {
                    ensureUserProfile(session.user)
                }
            } catch (error) {
                console.error('초기 인증 상태 확인 중 오류:', error)
                setSession(null)
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()

        // 인증 상태 변경 감지 (로그인/로그아웃)
        // Supabase listener
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('auth state change:', event, session)

            setSession(session)
            setUser(session?.user ?? null)
            setIsLoading(false)

            if (session?.user) {
                ensureUserProfile(session.user)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const loginWithKakao = async () => {
        const redirectTo = `${window.location.origin}/my`

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo,
            },
        })

        if (error) {
            console.error('카카오 로그인 실패:', error)
            throw error
        }
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            throw error
        }

        setSession(null)
        setUser(null)
    }

    const value = useMemo(
        () => ({
            user,
            session,
            isAuthenticated: !!user,
            isLoading,
            displayName: getDisplayName(user),
            profileImage: getProfileImage(user),
            loginWithKakao,
            logout,
        }),
        [user, session, isLoading],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.')
    }

    return context
}
