export interface LocalComment {
    id: string
    content: string
    createdAt: string
    userId: string
    author: {
        nickname: string
        avatar: string
    }
}
