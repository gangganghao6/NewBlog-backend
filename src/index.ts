import Fastify from 'fastify'
import dotenv from 'dotenv'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import fastifySession from '@fastify/session'
import fastifyStatic from '@fastify/static'
import fastifyRoutes from '@fastify/routes'
import fastifyCompress from '@fastify/compress'
import fastifyWebsocket from '@fastify/websocket'
import AliPaySdk from 'alipay-sdk'
import registeInterceptor from './interceptor/interceptor.js'
import {
  generateRoutesLogs,
  createLogStream,
  initMkdir,
  getProjectPath,
  getLocalIp
} from './utils.js'
import { registRoutes, registStatic } from './routes.js'
// import 'dayjs/locale/zh-cn'
// import dayjs from 'dayjs'

dotenv.config({
  path: '.env',
  override: true
})
// dayjs.locale('zh-cn')
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
// await prisma.$queryRaw`PRAGMA journal_mode=WAL`
// await prisma.$queryRaw`PRAGMA journal_mode=WAL`
fastify.prisma = prisma
fastify.alipaySdk = new AliPaySdk({
  appId: process.env.ALIPAY_APPID, // 自己的id
  gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do', // 这是支付宝官网沙箱测试网关
  privateKey: process.env.ALIPAY_PRIVATEKEY,
  alipayPublicKey: process.env.ALIPAY_PUBLICKEY
})

await fastify.register(fastifyCors, {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
})

await fastify.register(fastifyCompress, {
  global: true,
  encodings: ['deflate', 'gzip']
})
await fastify.register(fastifyStatic, {
  root: path.join(getProjectPath(), 'public'),
  prefix: '/public/'
})
await fastify.register(fastifyStatic, {
  root: path.join(getProjectPath(), 'frontdist'), // 前端代理
  prefix: '/frontdist',
  decorateReply: false
})
await fastify.register(fastifyCookie)
await fastify.register(fastifySession, {
  cookieName: 'sessionId',
  secret: 'a secret with minimum length of 32 characters',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // token有效期为7天
    sameSite: 'lax',
    secure: false
  }
})
await fastify.register(fastifyWebsocket, {
  options: {
    clientTracking: true,
    server: fastify.server
  }
}) // fastify.get('/', { websocket: true }, (connection, req) => {

await fastify.register(fastifyRoutes)
await fastify.register(fastifyMultipart, {
  limits: {
    // fieldNameSize: 100, // Max field name size in bytes
    // fieldSize: 100, // Max field value size in bytes
    // fields: 10, // Max number of non-file fields
    fileSize: 1024 * 1024 * 6 // For multipart forms, the max file size in bytes
    // files: 100 // Max number of file fields
    // headerPairs: 2000, // Max number of header key=>value pairs
    // parts: 1000 // For multipart forms, the max number of parts (fields + files)
  }
}) // await req.file()


await registeInterceptor(fastify)

await registStatic(fastify)
await registRoutes(fastify)
const start = async (): Promise<void> => {
  try {
    await fastify.listen({
      port: parseInt(process.env.PORT),
      host: getLocalIp()
    })
    generateRoutesLogs(fastify)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

await start()
