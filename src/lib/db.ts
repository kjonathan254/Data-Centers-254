import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL
  const token = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Please add it to your .env file or Vercel environment variables.'
    )
  }

  const libsql = createClient({
    url,
    authToken: token,
  })
  const adapter = new PrismaLibSql(libsql)
  return new PrismaClient({ adapter })
}

// Lazy initialization — only connects when first query runs
let _db: PrismaClient | undefined

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!_db) {
      _db = globalForPrisma.prisma ?? createPrismaClient()
      if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _db
    }
    return (_db as any)[prop]
  },
})
