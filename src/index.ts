import Fastify from 'fastify'
import dotenv from 'dotenv'
import path from 'path'
// import dayjs from 'dayjs'
import { PrismaClient } from '@prisma/client'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import fastifySession from '@fastify/session'
import fastifyStatic from '@fastify/static'
import fastifyRoutes from '@fastify/routes'
import fastifyCompress from '@fastify/compress'
import fastifyWebsocket from '@fastify/websocket'
import registeInterceptor from './interceptor/interceptor.js'
import { generateRoutesLogs, createLogStream, initMkdir } from './utils.js'
import { registRoutes, registStatic } from './routes.js'

dotenv.config({
  override: true
})
initMkdir()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString()
}
const FasitfyConfig = {
  logger: {
    level: 'info',
    stream: createLogStream()
    //   serializers: {
    //     req(request: FastifyRequest) {
    //       return {
    //         method: request.method,
    //         url: request.url,
    //         userAgent: request.headers['user-agent'],
    //         cookie: request.headers.cookie,
    //         hostname: request.hostname,
    //         remoteAddress: request.ip,
    //         remotePort: request.socket.remotePort
    //       }
    //     }
    //   }
  }
  // http2: true,
  // https: {
  //   allowHTTP1: true,
  //   cert: fs.readFileSync(
  //     path.join(process.env.PROJECT_PATH as string, 'keys/cert.crt')
  //   ),
  //   key: fs.readFileSync(
  //     path.join(process.env.PROJECT_PATH as string, 'keys/cert.key')
  //   )
  // }
}
export const fastify = Fastify(FasitfyConfig)
const prisma = new PrismaClient()
await prisma.$queryRaw`PRAGMA journal_mode=WAL`
fastify.prisma = prisma

await fastify.register(fastifyCors, {
  origin: [`${process.env.PUBLIC_URL}:${parseInt(process.env.FRONT_PORT)}`],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
})

await fastify.register(fastifyCompress, {
  global: true,
  encodings: ['deflate', 'gzip']
})
await fastify.register(fastifyStatic, {
  root: path.join(process.env.PROJECT_PATH, 'public'),
  prefix: '/public/' // optional: default '/'
})
await fastify.register(fastifyCookie)
await fastify.register(fastifySession, {
  // request.session.destroy(next) request.session.user = {name: 'max'}
  cookieName: 'sessionId',
  secret: 'a secret with minimum length of 32 characters',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: false
  }
})
await fastify.register(fastifyWebsocket) // fastify.get('/', { websocket: true }, (connection, req) => {

await fastify.register(fastifyRoutes)
await fastify.register(fastifyMultipart) // await req.file()

await registeInterceptor(fastify)

await registStatic(fastify)
await registRoutes(fastify)

const start = async (): Promise<void> => {
  try {
    await fastify.listen({
      port: parseInt(process.env.PORT),
      host: '0.0.0.0'
    })
    generateRoutesLogs(fastify)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

await start()
