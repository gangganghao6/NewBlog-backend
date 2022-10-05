import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from '../../utils'
import { getBlogList, postBlog } from './blogFn'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/blog', async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body
    try {
      const result = await postBlog(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    const query = req.query as {
      size: string
      page: string
      type?: string
    }
    const data = {
      size: parseInt(query.size, 10),
      page: parseInt(query.page, 10),
      type: query.type != null ? query.type : null
    }
    try {
      const result = await getBlogList(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}
