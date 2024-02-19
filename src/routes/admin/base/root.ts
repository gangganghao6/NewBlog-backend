import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { rootLogin, rootModify, rootRegist, getRootById } from './rootFn'
import { Root } from '../../../types/model'
import { createRequestReturn, promisifyJwtSign, validateRoot } from '../../../utils'
// const myJwtSign = promisifyJwtSign(jwt)
export default function (
  fastify: FastifyInstance,
  options = {},
  done: any
): void {
  fastify.post(
    '/login',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      // try {9b690776-cc6a-4821-9726-168c3f105418
      const data = req.body as RootLogin
      const result = await rootLogin(fastify, data)
      if (result === null) {
        throw new Error('账号或密码错误')
      }
      req.session.adminId = result.id
      // const token = await myJwtSign({ id: result.id, account: result.account, email: result.email }, process.env.JWT_KEY)
      // res.setCookie('token', token)
      return createRequestReturn(200, result as RootLoginReturn, '')
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
      try {
        await validateRoot(fastify, req.session.rootId)
        const data = req.body as RootModify
        const result = await rootModify(fastify, data)
        return createRequestReturn(200, result as Root, '')
      } catch (e) {
        return createRequestReturn(
          200,
          null,
          '原密码错误或账户不存在或数据格式错误'
        )
      }
    }
  )
  fastify.post('/auth', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const adminId = req.session.adminId
    console.log(adminId);
    const result = await getRootById(fastify, adminId)
    
    if (result === null) {
      throw new Error('未登录或登录失效')
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
  email: string,
  name: string
}

export interface RootRegist {
  account: string
  password: string
  email: string,
  name: string
}

export interface RootModify {
  id: string
  newPassword: string
  oldPassword: string,
  name: string
}
