import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn(
      '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Falling back to mock Supabase client.',
    )
    return null
  }

  return { url, key }
}

function createMockQuery() {
  const query: any = {
    _count: undefined,
    _single: false,
    select(_columns: string, opts?: { count?: string }) {
      if (opts?.count === 'exact') {
        query._count = 0
      }
      return query
    },
    order() {
      return query
    },
    eq() {
      return query
    },
    ilike() {
      return query
    },
    gte() {
      return query
    },
    lte() {
      return query
    },
    gt() {
      return query
    },
    limit() {
      return query
    },
    range() {
      return query
    },
    single() {
      query._single = true
      return query
    },
    then(onfulfilled: (value: any) => any) {
      const result = query._single
        ? { data: null, error: null }
        : { data: [], error: null, count: query._count }
      return Promise.resolve(result).then(onfulfilled)
    },
    catch() {
      return query
    },
  }

  return query
}

function createMockSupabase() {
  return {
    from: () => createMockQuery(),
  }
}

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const config = getSupabaseConfig()

  if (!config) {
    return createMockSupabase()
  }

  const cookieStore = await cookies()

  return createServerClient(
    config.url,
    config.key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
