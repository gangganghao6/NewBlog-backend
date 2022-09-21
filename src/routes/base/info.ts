import { BaseInfo } from '../../types/model'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from '../../utils'
import { getBaseInfo, postBaseInfo, putBaseInfo } from './infoFn'

export default function (
  fastify: FastifyInstance,
  options = {},
  done: any
): void {
  fastify.get('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const result: BaseInfo = await getBaseInfo(fastify)
    if (result === null) {
      return createRequestReturn(500, null, '您还未初始化博客信息')
    } else {
      return createRequestReturn(200, result, '')
    }
  })
  fastify.post('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const data: BaseInfo = req.body as BaseInfo
    try {
      const result: BaseInfo = await postBaseInfo(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e: any) {
      return createRequestReturn(500, null, e.message)
    }
  })
  fastify.put('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    let data: any = req.body
    if ('head_image' in data) {
      data = { ...data, head_image: { create: data.head_image } }
    }
    try {
      const result = await putBaseInfo(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e: any) {
      return createRequestReturn(500, null, e.message)
    }
  })
  done()
}
