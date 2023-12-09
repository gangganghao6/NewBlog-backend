import lodash from 'lodash'
import { BaseInfo } from '../../types/model'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../utils'
import { getBaseInfo, postBaseInfo, putBaseInfo } from './infoFn'
const { isNil } = lodash

export default function (
  fastify: FastifyInstance,
  options = {},
  done: any
): void {
  /*
  none params
   */
  fastify.get('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const baseInfo = getBaseInfo()
    if (isNil(baseInfo.name)) {
      return createRequestReturn(500, null, '您还未初始化博客信息')
    } else {
      // const result = await getBaseInfo(fastify, baseInfo)
      return createRequestReturn(200, baseInfo, '')
    }
  })
  fastify.post('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req.session.rootId)
    const baseInfo = getBaseInfo()
    // const exist = await fastify.prisma.baseInfo.findFirst()
    if (!isNil(baseInfo.name)) {
      return createRequestReturn(500, null, '博客已初始化')
    }
    try {
      const data = req.body as BaseInfoCreate
      const result = await postBaseInfo(fastify, data)
      return createRequestReturn(200, result as BaseInfo, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.put('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req.session.rootId)
    // const exist = await fastify.prisma.baseInfo.findFirst()
    const baseInfo = getBaseInfo()
    if (isNil(baseInfo.name)) {
      return createRequestReturn(500, null, '博客还未初始化')
    }
    try {
      const data = req.body as BaseInfoModify
      const result = await putBaseInfo(fastify, data, baseInfo)
      return createRequestReturn(200, result as BaseInfo, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}

export interface BaseInfoCreate {
  name: string
  headImage: {
    name: string
    url: string
    size: number
  }
}

export interface BaseInfoModify {
  name?: string
  headImage?: {
    name: string
    url: string
    size: bigint
  }
}
