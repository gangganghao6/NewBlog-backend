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
    const data = req.body as Comment
    try {
      const result = await postComments(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, '数据格式错误')
    }
  })
  fastify.delete(
    '/comments',
    async (req: FastifyRequest, res: FastifyReply) => {
      const data = req.body as {
        id: number
        blog_id?: string
        shuoshuo_id: string
        personal_id: string
        type: 'personal' | 'shuoshuo' | 'blog'
      }
      try {
        const result = await deleteComments(fastify, data)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, '数据格式错误')
      }
    }
  )
  done()
}
