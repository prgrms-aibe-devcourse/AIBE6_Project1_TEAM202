//@ts-ignore
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Authorization 헤더 가져오기
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 환경변수
    const supabaseUrl = Deno.env.get('PROJECT_URL')!
    const supabaseAnonKey = Deno.env.get('PROJECT_ANON_KEY')!
    const supabaseServiceRoleKey = Deno.env.get('SERVICE_ROLE_KEY')!
    const kakaoAdminKey = Deno.env.get('KAKAO_ADMIN_KEY')!

    // 사용자 권한 클라이언트 (현재 로그인 유저 확인용)
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    // 관리자 권한 클라이언트 (삭제용)
    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey)

    // 현재 유저 가져오기
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user session', detail: userError }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 카카오 정보
    const provider = user.app_metadata?.provider
    const providerId = user.user_metadata?.provider_id

    if (provider !== 'kakao' || !providerId) {
      return new Response(JSON.stringify({ error: 'Kakao provider_id not found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 1️⃣ public.users 삭제
    const { error: deletePublicUserError } = await adminClient
      .from('users')
      .delete()
      .eq('id', user.id)

    if (deletePublicUserError) {
      return new Response(
        JSON.stringify({
          error: 'Failed to delete public.users row',
          detail: deletePublicUserError,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // 2️⃣ 카카오 unlink
    const kakaoResponse = await fetch('https://kapi.kakao.com/v1/user/unlink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `KakaoAK ${kakaoAdminKey}`,
      },
      body: new URLSearchParams({
        target_id_type: 'user_id',
        target_id: String(providerId),
      }),
    })

    const kakaoJson = await kakaoResponse.json().catch(() => null)

    if (!kakaoResponse.ok) {
      return new Response(
        JSON.stringify({
          error: 'Failed to unlink Kakao account',
          detail: kakaoJson,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // 3️⃣ auth.users 삭제
    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(user.id, false)

    if (deleteAuthError) {
      return new Response(
        JSON.stringify({
          error: 'Failed to delete auth user',
          detail: deleteAuthError,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        kakao: kakaoJson,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Unexpected error',
        detail: String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})