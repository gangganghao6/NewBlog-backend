import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createUser, getUserByEmail, getUserById } from './userFn'
import { createRequestReturn } from '../../utils'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/login', async (req: FastifyRequest, res: FastifyReply) => {
    const email = (req.body as { email: string }).email
    const result = await getUserByEmail(fastify, email)
    if (result !== null) {
      return createRequestReturn(200, result, '')
    } else {
      return createRequestReturn(500, null, '登录失败')
    }
  })
  fastify.post('/regist', async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as { email: string; name: string }
    const exist = await getUserByEmail(fastify, data.email)
    if (exist !== null) {
      return createRequestReturn(500, null, '邮箱已被注册')
    }
    const result = await createUser(fastify, data)
    return createRequestReturn(200, result, '')
  })
  fastify.get('/user/:id', async (req: FastifyRequest, res: FastifyReply) => {
    const id = (req.params as { id: string }).id
    const result = await getUserById(fastify, id)
    return createRequestReturn(200, result, '')
  })
  // fastify.post(
  //   '/user/:id',
  //   async (req: FastifyRequest, res: FastifyReply) => {}
  // )
  done()
}
