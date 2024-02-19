import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyError
} from 'fastify'
import { getProjectPath, validateRoot, validateUser } from 'src/utils'
import fs from 'fs'
import path from 'path'
const authLists = JSON.parse(
  fs.readFileSync(
    path.join(getProjectPath(), 'src/interceptor/authLists.json'),
    'utf-8'
  )
)
const ADMIN_NO_AUTH_ROUTES = [
  '/base/root/login',
  '/base/root/regist',
  '/base/root/auth'
].map((e) => `/admin${e}`)
const FRONT_NO_AUTH_ROUTES = ['/users/login', '/users/regist'].map(
  (e) => `/front${e}`
)
async function registeInterceptor(fastify: FastifyInstance): Promise<void> {
  await fastify.addHook(
    'onRequest',
    async (req: FastifyRequest, res: FastifyReply) => {
      const url = req.url.replaceAll('/api', '')
      try {
        if (url.startsWith('/admin')) {
          !ADMIN_NO_AUTH_ROUTES.includes(url) &&
            (await validateRoot(fastify, req.session.adminId))
        } else if (url.startsWith('/front')) {
          !FRONT_NO_AUTH_ROUTES.includes(url) &&
            (await validateUser(fastify, req.session.userId))
        }
      } catch (e: any) {
        res.statusCode = 401
        res.send({ code: 401, data: null, message: '未登录' })
      }
    }
  )
  await fastify.addHook(
    'onError',
    async (req: FastifyRequest, res: FastifyReply, err: FastifyError) => {
      console.log(111)

      // await res.send(5555)
      // return createRequestReturn(500, null, err.message)
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
