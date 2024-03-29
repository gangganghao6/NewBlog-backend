import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyError
} from 'fastify'
import fs from 'fs'
import { postUserVisitLog } from 'src/routes/base/logFn'
async function registeInterceptor(fastify: FastifyInstance): Promise<void> {
  await fastify.addHook(//记录用户访问日志
    'onResponse',
    async (req: FastifyRequest, res: FastifyReply) => {
      if (!req.url.startsWith('/public') && req.headers.referer) {
        void postUserVisitLog(fastify, {
          data: { url: req.headers.referer },
          ip: req.ip,
          userId: req.session.userId,
          userAgent: req.headers['user-agent']
        })
      }
    }
  )
  await fastify.addHook(//解决后端代理前端history路由404问题
    'onSend',
    async (req: FastifyRequest, res: FastifyReply, payload: string) => {
      if (typeof payload === 'string' && payload.startsWith('{')) {
        const payloadObj = JSON.parse(payload)
        if (payloadObj.statusCode === 404) {
          res.header('Content-Type', 'text/html')
          return fs.readFileSync('./frontdist/index.html', 'utf-8')
        } else {
          return payload
        }
      }
    }
  )
  // await fastify.addHook(
  //   'onSend',
  //   async (req: FastifyRequest, res: FastifyReply, payload: string) => {
  //     console.log(222)
  //     return payload
  //   }
  // )
}

export default registeInterceptor
