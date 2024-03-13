import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import {
  confirmOrder,
  createPayOrder,
  createUser,
  getPayAll,
  getUserAll,
  getUserByEmail,
  // getUserById,
  getUserDetail,
  putUser
} from './userFn'
import { createRequestReturn } from 'src/utils'
import { Pay, User } from 'src/types/model'
import { validateRoot, validateUser } from 'src/auth'
export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/login', async (req: FastifyRequest, res: FastifyReply) => {
    const email = (req.body as { email: string }).email
    const result = await getUserByEmail(fastify, email)
    if (result !== null) {
      req.session.userId = result.id
      return createRequestReturn(200, result as UserLoginReturn, '')
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
    req.session.userId = result.id
    return createRequestReturn(200, result as UserLoginReturn, '')
  })
  fastify.get('/user/:id', async (req: FastifyRequest, res: FastifyReply) => {
    const id = (req.params as { id: string }).id
    const result = await getUserDetail(fastify, id)
    return createRequestReturn(200, result as UserLoginReturn, '')
  })
  fastify.put('/user/:id', async (req: FastifyRequest, res: FastifyReply) => {
    // try {
    //   await validateRoot(fastify, req.session.rootId)
    // } catch (e) {
    //   await validateUser(fastify, req.session.userId)
    // }
    const data = req.body as PutUser
    const id = (req.params as { id: string }).id
    const result = await putUser(fastify, data, id)
    return createRequestReturn(200, result as UserLoginReturn, '')
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    const data: any = req.query
    data.page = parseInt(data.page, 10)
    data.size = parseInt(data.size, 10)
    // data.isSubscribed = data.isSubscribed === 'true'
    // data.isBanned = data.isBanned === 'true'
    const result = await getUserAll(fastify, data)
    return createRequestReturn(200, result as UserLoginReturn[], '')
  })
  fastify.post('/auth', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const userId = req.session.userId
    if (userId === null || userId === undefined) {
      return res.code(401).send('未登录')
    }
    const result = await getUserDetail(fastify, userId)
    if (result === null) {
      return res.code(401).send('用户不存在')
    }
    return createRequestReturn(200, result as User, '')
  })
  // fastify.get(
  //   '/detail/:id',
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     try {
  //       await validateRoot(fastify, req.session.rootId)
  //       const id = (req.params as { id: string }).id
  //       const result = await getUserDetail(fastify, id)
  //       return createRequestReturn(200, result as User, '')
  //     } catch (e) {
  //       return createRequestReturn(500, null, (e as Error).message)
  //     }
  //   }
  // )
  fastify.post(
    '/pay/create',
    async (req: FastifyRequest, res: FastifyReply) => {
      await validateUser(fastify, req, res)
      const userId = req.session.userId
      const data = req.body as CreatePayOrder
      const result = await createPayOrder(fastify, { userId, ...data })
      return createRequestReturn(200, result as Pay, '')
    }
  )
  fastify.post(
    '/pay/confirm',
    async (req: FastifyRequest, res: FastifyReply) => {
      // await validateUser(fastify, req, res)
      const data = req.body as { outTradeNo: string }
      const result = await confirmOrder(fastify, data)
      return createRequestReturn(200, result as Pay, '')
    }
  )
  fastify.get('/pay/list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req, res)
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
  isSubscribed: boolean
  isBanned: boolean
}

export interface PutUser {
  name: string
  isBanned: boolean
  is_Subscribed: boolean
}

export interface CreatePayOrder {
  userId: string
  isMobile: boolean
  blogId: string
  money: number
  payType: 'alipay' | 'wechat'
}
