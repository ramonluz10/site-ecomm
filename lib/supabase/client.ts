import { createBrowserClient } from '@supabase/ssr'

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn(
      '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in the browser. Falling back to mock Supabase client.',
    )
    return null
  }

  return { url, key }
}

/* eslint-disable no-unused-vars */

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
    then(onfulfilled: (_value: any) => any) {
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

export function createClient() {
  const config = getSupabaseConfig()

  if (!config) {
    return createMockSupabase()
  }

  return createBrowserClient(
    config.url,
    config.key,
  )
}
