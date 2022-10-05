import { BaseInfo } from '../../types/model'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from '../../utils'
import { getBaseInfo, postBaseInfo, putBaseInfo } from './infoFn'

export default function (
  fastify: FastifyInstance,
  options = {},
  done: any
): void {
  /*
  none params
   */
  fastify.get('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const baseInfo = await fastify.prisma.baseInfo.findFirst()
    if (baseInfo === null) {
      return createRequestReturn(500, null, '您还未初始化博客信息')
    } else {
      const result: BaseInfo = await getBaseInfo(fastify, baseInfo)
      return createRequestReturn(200, result, '')
    }
  })
  fastify.post('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const exist = await fastify.prisma.baseInfo.findFirst()
    if (exist !== null) {
      return createRequestReturn(500, null, '博客已初始化')
    }
    const data: BaseInfo = req.body as BaseInfo
    try {
      const result: BaseInfo = await postBaseInfo(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.put('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const exist = await fastify.prisma.baseInfo.findFirst()
    if (exist === null) {
      return createRequestReturn(500, null, '博客还未初始化')
    }
    const data = req.body
    try {
      const result = await putBaseInfo(fastify, data, exist)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}
