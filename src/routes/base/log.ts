import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  getUserVisitAll,
  getUserVisitAnalysis,
  postUserVisitLog
} from './logFn'
import { createRequestReturn } from '../../utils'

export default function (
  fastify: FastifyInstance,
  config = {},
  done: any
): void {
  fastify.post('/url', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data: any = JSON.parse(req.body as any)
      const ip = req.ip
      const userAgent = req.headers['user-agent']
      await postUserVisitLog(fastify, {
        data,
        ip,
        userAgent
      })
      return createRequestReturn(200, '', '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data: any = req.query
      data.size = parseInt(data.size, 10)
      data.page = parseInt(data.page, 10)
      const result = await getUserVisitAll(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/analysis', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const result = await getUserVisitAnalysis(fastify)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}
