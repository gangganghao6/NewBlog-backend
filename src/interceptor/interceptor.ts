import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyError
} from 'fastify'
import { postUserVisitLog } from 'src/routes/base/logFn'
// const authLists = JSON.parse(
//   fs.readFileSync(
//     path.join(getProjectPath(), 'src/interceptor/authLists.json'),
//     'utf-8'
//   )
// )
// const ADMIN_NO_AUTH_ROUTES = [
//   '/base/root/login',
//   '/base/root/regist',
//   '/base/root/auth'
// ].map((e) => `/admin${e}`)
// const FRONT_NO_AUTH_ROUTES = ['/users/login', '/users/regist'].map(
//   (e) => `/front${e}`
// )
async function registeInterceptor(fastify: FastifyInstance): Promise<void> {
  await fastify.addHook(
    'onResponse',
    async (req: FastifyRequest, res: FastifyReply) => {
      if(req.url.startsWith('/public')) return
      await postUserVisitLog(fastify, {
        data: { url: req.headers.referer },
        ip: req.ip,
        userId: req.session.userId,
        userAgent: req.headers['user-agent']
      })
    }
  )
  // await fastify.addHook(
  //   'onError',
  //   async (req: FastifyRequest, res: FastifyReply, err: FastifyError) => {
  //     console.log(111)

  //     // await res.send(5555)
  //     // return createRequestReturn(500, null, err.message)
  //   }
  // )
  // await fastify.addHook(
  //   'onSend',
  //   async (req: FastifyRequest, res: FastifyReply, payload: string) => {
  //     console.log(222)
  //     return payload
  //   }
  // )
}

export default registeInterceptor
