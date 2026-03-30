export type TravelType = 'HEALING' | 'SHOPPING' | 'FOOD' | 'PHOTO' | 'CALM' | 'EXPLORER'

export type { AnswerOption, Question, ScoreMap } from './models/testTypes'

export interface Place {
    id: string
    name: string
    description: string
    imageUrl: string
    tags: string[]
    location: string
    type: TravelType
}

export type { ResultType } from './models/testTypes'

export interface User {
    id: string
    email: string
    nickname: string
    avatar: string
    travelType: TravelType
    createdAt: string
}

export interface MockPost {
    id: string
    author: User
    title: string
    content: string
    image: string
    likeCount: number
    commentCount: number
    isLiked: boolean
    isBookmarked: boolean
    type: TravelType
    createdAt: string
    comments: Comments[]
}

export interface Comments {
    id: string
    author: User
    content: string
    createdAt: string
}

export { resultTypes } from './mock/resultTypes'

export const mockUsers: User[] = [
    {
        id: 'u1',
        email: 'photo@test.com',
        nickname: '지윤',
        avatar: 'https://i.pravatar.cc/150?u=1',
        travelType: 'PHOTO',
        createdAt: '2023-01-01',
    },
    {
        id: 'u2',
        email: 'food@test.com',
        nickname: '민수',
        avatar: 'https://i.pravatar.cc/150?u=2',
        travelType: 'FOOD',
        createdAt: '2023-02-15',
    },
    {
        id: 'u3',
        email: 'healing@test.com',
        nickname: '수아',
        avatar: 'https://i.pravatar.cc/150?u=3',
        travelType: 'HEALING',
        createdAt: '2023-03-20',
    },
    {
        id: 'u4',
        email: 'city@test.com',
        nickname: '태형',
        avatar: 'https://i.pravatar.cc/150?u=4',
        travelType: 'SHOPPING',
        createdAt: '2023-04-10',
    },
]

export const posts: MockPost[] = [
    {
        id: 'post1',
        author: mockUsers[0],
        title: '강릉 안목해변에서 인생샷 건졌어요 📸',
        content:
            '바다 색감 미쳤다...💙 여기서 찍은 사진만 100장 넘음! 날씨 좋은 날 꼭 가보세요. 카페거리에서 커피 한 잔 하면서 바다 보면 진짜 힐링 그 자체입니다.',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
        likeCount: 124,
        commentCount: 12,
        isLiked: false,
        isBookmarked: true,
        type: 'PHOTO',
        createdAt: '2023-10-01T10:00:00Z',
        comments: [
            {
                id: 'c1',
                author: mockUsers[1],
                content: '와 진짜 예쁘네요! 저도 가보고 싶어요 ㅠㅠ',
                createdAt: '2023-10-01T11:00:00Z',
            },
            {
                id: 'c2',
                author: mockUsers[2],
                content: '사진 색감 보정 어떻게 하셨어요? 꿀팁 공유해주세요!',
                createdAt: '2023-10-01T12:00:00Z',
            },
        ],
    },
    {
        id: 'post2',
        author: mockUsers[1],
        title: '전주 한옥마을 먹방 투어 대성공 🤤',
        content:
            '웨이팅 1시간 한 보람이 있는 맛! 길거리 음식부터 한정식까지 입에서 살살 녹아요. 특히 육전이랑 치즈구이는 꼭 드셔보세요 강추합니다.',
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800',
        likeCount: 89,
        commentCount: 5,
        isLiked: true,
        isBookmarked: false,
        type: 'FOOD',
        createdAt: '2023-10-02T14:30:00Z',
        comments: [
            {
                id: 'c1',
                author: mockUsers[1],
                content: '와 진짜 예쁘네요! 저도 가보고 싶어요 ㅠㅠ',
                createdAt: '2023-10-01T11:00:00Z',
            },
            {
                id: 'c2',
                author: mockUsers[2],
                content: '사진 색감 보정 어떻게 하셨어요? 꿀팁 공유해주세요!',
                createdAt: '2023-10-01T12:00:00Z',
            },
        ],
    },
    {
        id: 'post3',
        author: mockUsers[2],
        title: '사려니숲길, 조용히 걷기 좋은 곳 🌿',
        content:
            '아무것도 안 하고 가만히 숲소리만 들어도 힐링되는 기분. 피톤치드 가득 마시고 왔어요. 복잡한 생각 비우고 싶을 때 추천해요.',
        image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=800',
        likeCount: 256,
        commentCount: 24,
        isLiked: false,
        isBookmarked: false,
        type: 'HEALING',
        createdAt: '2023-10-03T09:15:00Z',
        comments: [
            {
                id: 'c1',
                author: mockUsers[1],
                content: '와 진짜 예쁘네요! 저도 가보고 싶어요 ㅠㅠ',
                createdAt: '2023-10-01T11:00:00Z',
            },
            {
                id: 'c2',
                author: mockUsers[2],
                content: '사진 색감 보정 어떻게 하셨어요? 꿀팁 공유해주세요!',
                createdAt: '2023-10-01T12:00:00Z',
            },
        ],
    },
    {
        id: 'post4',
        author: mockUsers[3],
        title: '해운대 블루라인파크 야경 미쳤음 ✨',
        content:
            '이번 주말 팝업스토어 도장깨기 완료! 해변열차 타고 보는 야경까지 완벽했다. 도시의 활기를 제대로 느끼고 온 주말 여행.',
        image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800',
        likeCount: 167,
        commentCount: 8,
        isLiked: false,
        isBookmarked: true,
        type: 'SHOPPING',
        createdAt: '2023-10-04T20:45:00Z',
        comments: [
            {
                id: 'c1',
                author: mockUsers[1],
                content: '와 진짜 예쁘네요! 저도 가보고 싶어요 ㅠㅠ',
                createdAt: '2023-10-01T11:00:00Z',
            },
            {
                id: 'c2',
                author: mockUsers[2],
                content: '사진 색감 보정 어떻게 하셨어요? 꿀팁 공유해주세요!',
                createdAt: '2023-10-01T12:00:00Z',
            },
        ],
    },
]
