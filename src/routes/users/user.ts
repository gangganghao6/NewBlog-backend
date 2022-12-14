import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import {
  confirmOrder,
  createPayOrder,
  createUser,
  getPayAll,
  getUserAll,
  getUserByEmail,
  getUserById,
  getUserDetail,
  putUser
} from './userFn'
import { createRequestReturn, validateRoot, validateUser } from '../../utils'
import { Pay, User } from '../../types/model'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/login', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const email = (req.body as { email: string }).email
      const result = await getUserByEmail(fastify, email)
      if (result !== null) {
        req.session.set('user_id', result.id)
        return createRequestReturn(200, result as UserLoginReturn, '')
      } else {
        return createRequestReturn(500, null, '登录失败')
      }
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.post('/regist', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data = req.body as { email: string; name: string }
      const exist = await getUserByEmail(fastify, data.email)
      if (exist !== null) {
        return createRequestReturn(500, null, '邮箱已被注册')
      }
      const result = await createUser(fastify, data)
      req.session.set('user_id', result.id)
      return createRequestReturn(200, result as UserLoginReturn, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/user/:id', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const id = (req.params as { id: string }).id
      const result = await getUserById(fastify, id)
      return createRequestReturn(200, result as UserLoginReturn, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.put('/user/:id', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      try {
        await validateRoot(fastify, req.session.root_id)
      } catch (e) {
        await validateUser(fastify, req.session.user_id)
      }
      const data = req.body as PutUser
      const id = (req.params as { id: string }).id
      const result = await putUser(fastify, data, id)
      return createRequestReturn(200, result as UserLoginReturn, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/user_list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.root_id)
      const data: any = req.query
      data.page = parseInt(data.page, 10)
      data.size = parseInt(data.size, 10)
      data.is_subscribed = data.is_subscribed === 'true'
      data.is_banned = data.is_banned === 'true'
      const result = await getUserAll(fastify, data)
      return createRequestReturn(200, result as UserLoginReturn[], '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get(
    '/user_detail/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.root_id)
        const id = (req.params as { id: string }).id
        const result = await getUserDetail(fastify, id)
        return createRequestReturn(200, result as User, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.post(
    '/pay/create',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateUser(fastify, req.session.user_id)
        const data = req.body as CreatePayOrder
        const result = await createPayOrder(fastify, data)
        return createRequestReturn(200, result as Pay, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.get(
    '/pay/confirm',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateUser(fastify, req.session.user_id)
        const data = req.query as { out_trade_no: string }
        const result = await confirmOrder(fastify, data)
        return createRequestReturn(200, result as Pay, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.get('/pay/list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.root_id)
      const data: any = req.query
      data.page = parseInt(data.page, 10)
      data.size = parseInt(data.size, 10)
      const result = await getPayAll(fastify, data)
      return createRequestReturn(200, result as Pay[], '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}

export interface UserLoginReturn {
  id: string
  name: string
  email: string
  is_subscribed: boolean
  is_banned: boolean
}

export interface PutUser {
  name: string
  is_banned: boolean
  is_subscribed: boolean
}

export interface CreatePayOrder {
  user_id: string
  type: 'blog' | 'personal'
  blog_id: string
  money: number
  pay_type: 'alipay' | 'wechat'
}
