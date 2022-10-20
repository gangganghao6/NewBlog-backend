import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { deleteComments, postComments } from './commentsFn'
import { createRequestReturn, validateRoot, validateUser } from '../../utils'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/comments', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateUser(fastify, req.session.user_id)
      const data = req.body as CommentsCreate
      const result = await postComments(fastify, data)
      return createRequestReturn(200, result as Comment, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.delete(
    '/comments',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.root_id)
        const data = req.body as CommentsDelete
        const result = await deleteComments(fastify, data)
        return createRequestReturn(
          200,
          result as {
            count: number
          },
          ''
        )
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}

export interface CommentsCreate {
  comment: string
  user_id?: string
  blog_id?: string
  shuoshuo_id?: string
  personal_id?: string // 只要不是null和undefined就行
}

export interface CommentsDelete {
  id?: number
  blog_id?: string
  shuoshuo_id?: string
  personal_id?: string
}
