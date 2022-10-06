import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { deleteComments, postComments } from './commentsFn'
import { Comment } from '../../types/model'
import { createRequestReturn } from '../../utils'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/comments', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data = req.body as Comment
      const result = await postComments(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.delete(
    '/comments',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const data = req.body as {
          id: number
          blog_id?: string
          shuoshuo_id?: string
          personal_id?: string
        }
        const result = await deleteComments(fastify, data)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}
