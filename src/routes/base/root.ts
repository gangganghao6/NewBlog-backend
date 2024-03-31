import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { rootLogin, rootModify, rootRegist, getRootById } from './rootFn'
import { Root } from 'src/types/model'
import {
  createRequestReturn,
} from 'src/utils'
export default function (
  fastify: FastifyInstance,
  options = {},
  done: any
): void {
  fastify.post(
    '/login',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const data = req.body as RootLogin
      const result = await rootLogin(fastify, data)
      if (result === null) {
        throw new Error('账号或密码错误')
      }
      req.session.adminId = result.id
      return createRequestReturn(200, result, '')
    }
  )
  fastify.post(
    '/logout',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      req.session.adminId = null
      return createRequestReturn(200, null, '')
    }
  )
  fastify.post(
    '/regist',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const data = req.body as RootRegist
      const result = await rootRegist(fastify, data)
      req.session.adminId = result.id
      return createRequestReturn(200, result as Root, '')
    }
  )
  fastify.put(
    '/modify',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const data = req.body as RootModify
      const result = await rootModify(fastify, data)
      return createRequestReturn(200, result as Root, '')
    }
  )
  fastify.post('/auth', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const adminId = req.session.adminId
    if (adminId === null) {
      throw new Error('未登录')
    }
    const result = await getRootById(fastify, adminId)
    if (result === null) {
      throw new Error('登录失效')
    }
    return createRequestReturn(200, result as Root, '')
  })
  done()
}

export interface RootLogin {
  account: string
  password: string
}

export interface RootLoginReturn {
  id: string
  account: string
  email: string
  name: string
}

export interface RootRegist {
  account: string
  password: string
  email: string
  name: string
}

export interface RootModify {
  id: string
  newPassword: string
  oldPassword: string
  name: string
}
