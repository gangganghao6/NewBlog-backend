import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { rootLogin, rootModify, rootRegist } from './rootFn'
import { Root } from '../../types/model'
import { createRequestReturn } from '../../utils'

export default function (
  fastify: FastifyInstance,
  options = {},
  done: any
): void {
  fastify.post(
    '/login',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const data = req.body as Root
      const result = await rootLogin(fastify, data)
      if (!result) {
        return createRequestReturn(500, null, '登录失败')
      } else {
        return createRequestReturn(200, result, '')
      }
    }
  )
  fastify.post(
    '/regist',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const data = req.body as Root
      try {
        const result = await rootRegist(fastify, data)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(200, null, '账号或邮箱已存在或数据格式错误')
      }
    }
  )
  fastify.put(
    '/modify',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const data = req.body as Root & {
        old_password: string
        new_password: string
      }
      try {
        const result = await rootModify(fastify, data)
        return createRequestReturn(200, result, '')
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
