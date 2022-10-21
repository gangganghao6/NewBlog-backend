import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { rootLogin, rootModify, rootRegist } from './rootFn'
import { Root } from '../../types/model'
import { createRequestReturn, validateRoot } from '../../utils'

export default function (
  fastify: FastifyInstance,
  options = {},
  done: any
): void {
  fastify.post(
    '/login',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      try {
        const data = req.body as RootLogin
        const result = await rootLogin(fastify, data)
        if (result === null) {
          return createRequestReturn(500, null, '登录失败')
        }
        req.session.root_id = result.id
        return createRequestReturn(200, result as RootLoginReturn, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.post(
    '/regist',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const data = req.body as RootRegist
      try {
        const result = await rootRegist(fastify, data)
        req.session.root_id = result.id
        return createRequestReturn(200, result as Root, '')
      } catch (e) {
        return createRequestReturn(200, null, '账号或邮箱已存在或数据格式错误')
      }
    }
  )
  fastify.put(
    '/modify',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      try {
        await validateRoot(fastify, req.session.root_id)
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
  done()
}

export interface RootLogin {
  account?: string
  password: string
}

export interface RootLoginReturn {
  id: string
  account: string
  email: string
}

export interface RootRegist {
  account: string
  password: string
  email: string
}

export interface RootModify {
  id: string
  new_password: string
  old_password: string
}
