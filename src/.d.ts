import { PrismaClient } from '@prisma/client'
import AlipaySdk from 'alipay-sdk'

export declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient,
    alipaySdk: AlipaySdk
  }

  interface ProcessEnv {
    [key: string]: string
  }

  interface Session {
    [x: string]: any
    userId?: string | null
    adminId?: string | null
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
      JWT_SECRET: string
    }
  }
}
