import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { rootLogin, rootModify, rootRegist, getRootById } from './rootFn'
import {
  createRequestReturn,
} from 'src/utils'
export default function (
  fastify: FastifyInstance,
  options = {},
  done: any
): void {
  fastify.post(
    '/search',
    {},
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const data = req.body as any

      return createRequestReturn(200, {}, '')
    }
  )
  done()
}