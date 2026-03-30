import { ArrowLeftIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'

// 프로필 수정 페이지
// - 사용자 프로필 조회
// - 닉네임 및 프로필 이미지 수정
// - Supabase users 테이블 업데이트

// users 테이블 프로필 타입
type Profile = {
    id: string
    nickname: string | null
    avatar_url: string | null
    created_at: string
}

export const EditProfile: React.FC = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated, isLoading } = useAuth()

    const [profile, setProfile] = useState<Profile | null>(null)
    const [nicknameInput, setNicknameInput] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, isLoading, navigate])

    // 기존 사용자 프로필 조회 후 입력값 초기화
    // users 테이블에서 현재 사용자 프로필 조회
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return

            setIsFetching(true)

            const { data, error } = await supabase
                .from('users')
                .select('id, nickname, avatar_url, created_at')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('프로필 조회 실패:', error)
                setIsFetching(false)
                return
            }

            setProfile(data)
            setNicknameInput(data?.nickname || '')
            setIsFetching(false)
        }

        fetchProfile()
    }, [user])

    // 프로필 저장 처리
    // - 닉네임 검증
    // - 이미지 업로드 (선택)
    // - users 테이블 업데이트
    const handleSave = async () => {
        if (!user) return

        const trimmedNickname = nicknameInput.trim()

        if (!trimmedNickname) {
            alert('닉네임을 입력해주세요.')
            return
        }
        try {
            setIsSaving(true)
            let newAvatarUrl = profile?.avatar_url
            //프로필 이미지가 선택된 경우 Storage에 업로드
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${user.id}_${Date.now()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                    .from('profile')
                    .upload(fileName, imageFile, { upsert: true })
                if (uploadError) {
                    console.error('프로필 이미지 업로드 실패:', uploadError)
                    alert('프로필 이미지 업로드에 실패했습니다.')
                    setIsSaving(false)
                    return
                }
                const { data: publicUrlData } = supabase.storage.from('profile').getPublicUrl(fileName)

                newAvatarUrl = publicUrlData.publicUrl
            }
            const { error } = await supabase
                .from('users')
                .update({ nickname: trimmedNickname, avatar_url: newAvatarUrl })
                .eq('id', user.id)

            if (error) {
                console.error('닉네임 저장 실패:', error)
                alert('닉네임 저장에 실패했습니다.')
                return
            }

            await supabase.auth.refreshSession()

            alert('닉네임과 프로필이 저장되었습니다.')
            navigate('/my')
        } catch (error) {
            console.error('닉네임 저장 중 오류:', error)
            alert('닉네임 저장 중 오류가 발생했습니다.')
        } finally {
            setIsSaving(false)
        }
    }
    // 인증 또는 프로필 데이터 로딩 중일 때 표시
    if (isLoading || isFetching) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <p className="text-sm text-text-muted">프로필 정보를 불러오는 중...</p>
            </div>
        )
    }

    // 로그인되지 않은 경우 렌더링 중단
    if (!user) {
        return null
    }
    // 프로필 업로드 시 미리보기
    const avatarSrc = previewUrl || profile?.avatar_url || 'https://i.pravatar.cc/150?img=12'
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    return (
        <div className="min-h-full bg-background pb-24">
            <div className="px-6 pt-8">
                <button
                    type="button"
                    onClick={() => navigate('/my')}
                    className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    뒤로가기
                </button>
            </div>

            <div className="px-6 pt-4">
                <Card className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                            <img src={avatarSrc} alt="프로필 이미지" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <span className="text-white text-xs font-semibold">사진 변경</span>
                            </div>
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept="image/*"
                                title="프로필 이미지 변경"
                                onChange={handleFileChange}
                            />
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-text">프로필 수정</h1>
                        <p className="mt-1 text-sm text-text-muted">닉네임과 사진을 변경할 수 있어요.</p>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-text mb-2">닉네임</label>
                        <input
                            type="text"
                            value={nicknameInput}
                            onChange={(e) => setNicknameInput(e.target.value)}
                            placeholder="닉네임을 입력하세요"
                            maxLength={20}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
                        />
                        <p className="mt-2 text-xs text-text-muted">20자 이내로 입력해주세요.</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button variant="secondary" fullWidth className="py-3 text-sm" onClick={() => navigate('/my')}>
                            취소
                        </Button>

                        <Button
                            variant="primary"
                            fullWidth
                            className="py-3 text-sm"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? '저장 중...' : '저장'}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
