import { supabase } from '../lib/supabase'

export interface CreatePostInput {
    title: string
    content: string
    image_url?: string | null
    travel_type: string
    user_id?: string | null
}
export interface PostAuthor {
    //posts 테이블의 user_id 와 users 테이블의 id가 외래키로 연결되어 있어 join
    id: string
    nickname: string
    avatar_url: string | null
}

export interface Post {
    id: string
    title: string
    content: string
    image_url: string | null
    travel_type: string
    like_count: number
    comment_count: number
    user_id: string | null
    created_at: string
    author: PostAuthor | null
}

export type PostSortType = 'latest' | 'mostLiked' | 'mostCommented'
export interface Comment {
    id: string
    post_id: string
    user_id: string
    content: string
    created_at: string
    nickname: string | null
    avatar_url: string | null
}

export const getCurrentUserId = async (): Promise<string | null> => {
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id ?? null
    console.log('getCurrentUserId:', userId)
    return userId
}

// posts 테이블 레코드 수 확인
export const getPostCount = async () => {
    const { count, error } = await supabase.from('posts').select('*', { count: 'exact', head: true })

    if (error) {
        console.error('getPostCount error:', error)
        throw error
    }

    console.log('getPostCount count:', count)
    return { count: count ?? 0 }
}

// posts 테이블에 게시글 저장
export const savePost = async (post: CreatePostInput) => {
    const { data, error } = await supabase
        .from('posts')
        .insert({
            title: post.title,
            content: post.content,
            image_url: post.image_url ?? null,
            travel_type: post.travel_type,
            like_count: 0,
            comment_count: 0,
            user_id: post.user_id ?? null,
        })
        .select()

    if (error) {
        throw error
    }

    return data
}

// posts 테이블 전체 조회 (저장 확인용)
// export const getPosts = async (): Promise<Post[]> => {
//     const { data, error } = await supabase
//         .from('posts')
//         .select(
//             `
//             id,
//             title,
//             content,
//             image_url,
//             travel_type,
//             like_count,
//             comment_count,
//             user_id,
//             created_at,
//             author:users (
//                 id,
//                 nickname,
//                 avatar_url
//             )
//         `,
//         )
//         .order('created_at', { ascending: false })

//     if (error) {
//         console.error('getPosts error:', error)
//         throw error
//     }

//     const normalizedPosts: Post[] =
//         data?.map((post) => ({
//             ...post,
//             author: Array.isArray(post.author) ? (post.author[0] ?? null) : (post.author ?? null),
//         })) ?? []

//     return normalizedPosts
// }

export const getPosts = async (sortType: PostSortType = 'latest', filterType?: string): Promise<Post[]> => {
    let query = supabase.from('posts').select(`
            id,
            title,
            content,
            image_url,
            travel_type,
            like_count,
            comment_count,
            user_id,
            created_at,
            author:users (
                id,
                nickname,
                avatar_url
            )
        `)

    // 여행 타입 필터
    if (filterType && filterType !== 'ALL') {
        query = query.eq('travel_type', filterType)
    }

    // 정렬
    if (sortType === 'latest') {
        query = query.order('created_at', { ascending: false })
    }

    if (sortType === 'mostLiked') {
        query = query.order('like_count', { ascending: false })
    }

    if (sortType === 'mostCommented') {
        query = query.order('comment_count', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
        console.error('getPosts error:', error)
        throw error
    }

    const normalizedPosts: Post[] =
        data?.map((post) => ({
            ...post,
            author: Array.isArray(post.author) ? (post.author[0] ?? null) : (post.author ?? null),
        })) ?? []

    return normalizedPosts
}

// 이미지를 Storage에 업로드하고 URL 반환
export const uploadPostImage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('posts').upload(fileName, file)
    if (error) {
        console.error('uploadPostImage error:', error)
        throw error
    }
    const { data } = supabase.storage.from('posts').getPublicUrl(fileName)
    return data.publicUrl
}

// 단건조회
export const getPostById = async (postId: string): Promise<Post | null> => {
    const { data, error } = await supabase
        .from('posts')
        .select(
            `
            id,
            title,
            content,
            image_url,
            travel_type,
            like_count,
            comment_count,
            user_id,
            created_at,
            author:users (
                id,
                nickname,
                avatar_url
            )
        `,
        )
        .eq('id', postId)
        .single()

    if (error) {
        console.error('getPostById error:', error)
        return null
    }

    return {
        ...data,
        author: Array.isArray(data.author) ? (data.author[0] ?? null) : (data.author ?? null),
    }
}

// 북마크
export const toggleBookmark = async (postId: string, userId: string): Promise<boolean> => {
    const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle()

    if (existing) {
        const { error } = await supabase.from('bookmarks').delete().eq('post_id', postId).eq('user_id', userId)
        if (error) console.error('북마크 삭제 실패:', error)
        return false
    } else {
        const { error } = await supabase.from('bookmarks').insert({ post_id: postId, user_id: userId })
        if (error) console.error('북마크 저장 실패:', error)
        return true
    }
}

export const getBookmarkedPostIds = async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase.from('bookmarks').select('post_id').eq('user_id', userId)
    if (error) return []
    return data.map((d) => d.post_id)
}

// 댓글
export const getComments = async (postId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
        .from('comments_with_author')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
    if (error) return []
    return data ?? []
}

export const saveComment = async (postId: string, userId: string, content: string): Promise<Comment | null> => {
    const { data, error } = await supabase
        .from('comments')
        .insert({ post_id: postId, user_id: userId, content })
        .select()
        .single()

    if (error) throw error
    await supabase.rpc('increment_comment_count', { post_id: postId })

    const { data: commentWithAuthor, error: fetchError } = await supabase
        .from('comments_with_author')
        .select('*')
        .eq('id', data.id)
        .single()

    if (fetchError) {
        console.error('saveComment fetch error:', fetchError)
        return data // 실패 시 기본 데이터라도 반환
    }

    return commentWithAuthor
}

//좋아요
export const toggleLike = async (postId: string, userId: string): Promise<boolean> => {
    const { data: existing } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle()

    if (existing) {
        const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId)
        if (error) console.error('좋아요 삭제 실패:', error)
        const { error: rpcError } = await supabase.rpc('decrement_like_count', { post_id: postId })
        if (rpcError) console.error('decrement_like_count 실패:', rpcError)
        return false
    } else {
        const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: userId })
        if (error) console.error('좋아요 저장 실패:', error)
        const { error: rpcError } = await supabase.rpc('increment_like_count', { post_id: postId })
        if (rpcError) console.error('increment_like_count 실패:', rpcError)
        return true
    }
}

export const getLikedPostIds = async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase.from('post_likes').select('post_id').eq('user_id', userId)
    if (error) return []
    return data.map((d) => d.post_id)
}
