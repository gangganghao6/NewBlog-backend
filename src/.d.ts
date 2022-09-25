import { PrismaClient } from '@prisma/client'

export declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }

  interface ProcessEnv {
    [key: string]: string
  }

  interface Session {
    user: string
  }
}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PROJECT_PATH: string
      DATABASE_URL: string
      PORT: number
      ISDEV: boolean
      PUBLIC_URL: string
    }
  }
}
