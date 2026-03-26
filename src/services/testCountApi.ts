import { supabase } from '../lib/supabase'

export const getTestCount = async () => {
    const { count, error } = await supabase.from('test_results').select('*', { count: 'exact', head: true })

    if (error) {
        throw error
    }

    return { count: count ?? 0 }
}

export const saveTestResult = async (resultType: string, userId?: string | null) => {
    const { error } = await supabase.from('test_results').insert({
        result_type: resultType,
        user_id: userId ?? null,
    })

    if (error) {
        throw error
    }
}
