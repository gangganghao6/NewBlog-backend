import { PrismaClient } from '@prisma/client'

export declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }

  interface ProcessEnv {
    [key: string]: string
  }

  interface Session {
    user_id?: string
    root_id?: string
  }
}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PROJECT_PATH: string
      DATABASE_URL: string
      PORT: number
      ISDEV: string
      PUBLIC_URL: string
      GITHUB_NAME: string
      ALIPAY_APPID: string
      ALIPAY_PRIVATEKEY: string
      ALIPAY_PUBLICKEY: string
      CRYPTO_KEY: string
      EMAIL_SMTP_ACCOUNT: string
      EMAIL_SMTP_PASS: string
      EMAIL_SMTP_HOST: string
      EMAIL_SMTP_PORT: number
    }
  }
}
