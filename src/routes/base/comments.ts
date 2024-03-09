import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { deleteComment, postComment } from './commentsFn'
import { createRequestReturn } from 'src/utils'
import { validateRoot, validateUser } from 'src/auth'
export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/comments', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateUser(fastify, req.session.userId)
      const data = req.body as CommentsCreate
      const result = await postComment(fastify, data)
      return createRequestReturn(200, result as Comment, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.delete(
    '/comments/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.rootId)
        // const data = req.body as CommentsDelete
        const id = (req.params as { id: string }).id
        const result = await deleteComment(fastify, id)
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
  userId: string
  blogId?: string
  shuoshuoId?: string
  personalId?: string // 只要不是null和undefined就行
}
