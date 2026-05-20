import { Pool, QueryResult } from 'pg'

const publicPool = new Pool({ connectionString: process.env.DATABASE_URL_PUBLIC })
const adminPool = new Pool({ connectionString: process.env.DATABASE_URL_ADMIN || process.env.DATABASE_URL_PUBLIC })

export async function queryPublic(sql: string, params: any[] = []): Promise<QueryResult> {
  return publicPool.query(sql, params)
}

export async function queryAdmin(sql: string, params: any[] = []): Promise<QueryResult> {
  return adminPool.query(sql, params)
}
