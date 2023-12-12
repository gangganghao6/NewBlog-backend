import { PrismaClient } from '@prisma/client'

export declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }

  interface ProcessEnv {
    [key: string]: string
  }

  interface Session {
    userId?: string
    rootId?: string
  }
}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PROJECT_PATH: string
      DATABASE_URL: string
      PORT: string
      FRONT_PORT: string
      PUBLIC_URL: string
      GITHUB_NAME: string
      ALIPAY_APPID: string
      ALIPAY_PRIVATEKEY: string
      ALIPAY_PUBLICKEY: string
      CRYPTO_KEY: string
      EMAIL_SMTP_ACCOUNT: string
      EMAIL_SMTP_PASS: string
      EMAIL_SMTP_HOST: string
      EMAIL_SMTP_PORT: string
      NODE_ENV: string
    }
  }
}
