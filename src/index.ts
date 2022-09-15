import Fastify from 'fastify'
import dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import cors from '@fastify/cors'
import dayjs from 'dayjs'
import middie from '@fastify/middie'
import fastifyCookie from '@fastify/cookie'
import { PrismaClient } from '@prisma/client'
// import multipart from '@fastify/multipart'
import { beforeSend, beforeRequest } from './interceptor/interceptor.js'
import base from './routes/total.js'

dotenv.config()

const prisma = new PrismaClient()
await prisma.$queryRaw`PRAGMA journal_mode=WAL`
const currentDate = dayjs(new Date()).format('YYYY-MM-DD')

const fastify = Fastify({
  logger:
    process.env.ISDEV === 'true'
      ? true
      : {
          level: 'info',
          file: `./log/${currentDate}.txt`
        },
  http2: true,
  https: {
    allowHTTP1: true,
    cert: fs.readFileSync(
      path.join(process.env.PROJECT_PATH as string, 'keys/cert.crt')
    ),
    key: fs.readFileSync(
      path.join(process.env.PROJECT_PATH as string, 'keys/cert.key')
    )
  }
})
await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

await fastify.register(middie, {
  hook: 'onRequest' // default
})
await fastify.register(fastifyCookie, {
  secret: 'my-secret', // for cookies signature
  hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {} // options for parsing cookies，
})
beforeRequest(fastify)
beforeSend(fastify)

await fastify.register(base, { prefix: '/api/base', prisma })

/**
 * Run the server!
 */
const start = async (): Promise<void> => {
  try {
    await fastify.listen({
      port: parseInt(process.env.PORT as string),
      host: '0.0.0.0'
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

await start()
