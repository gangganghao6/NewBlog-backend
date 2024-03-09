import lodash from 'lodash'
import { BaseInfo, Image } from 'src/types/model'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from 'src/utils'
import { getBaseInfo, getSummaryInfo, putBaseInfo } from './infoFn'
import { validateRoot } from 'src/auth'
const { isNil } = lodash

export default function (
  fastify: FastifyInstance,
  options = {},
  done: any
): void {
  fastify.get('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const result = await getBaseInfo(fastify)
    return createRequestReturn(200, result, '')
  })
  fastify.put('/info', {}, async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const data = req.body as BaseInfoModify
    const result = await putBaseInfo(fastify, data)
    return createRequestReturn(200, result as BaseInfo, '')
  })
  fastify.get('/summaryInfo', {}, async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const result = await getSummaryInfo(fastify)
    return createRequestReturn(200, result, '')
  })
  done()
}


export interface BaseInfoModify {
  name?: string
  description?: string
  recommendBlogIds?: string
  headImage?: Image
}
