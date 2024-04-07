import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { deleteComment, getCommentsList, postComment } from './commentsFn'
import { createRequestReturn } from 'src/utils'
import { validateRoot, validateUser } from 'src/auth'
export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/comments', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateUser(fastify, req, res)
      const data = req.body as CommentsCreate
      data.userId = req.session.userId
      const result = await postComment(fastify, data)
      return createRequestReturn(200, result as Comment, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/comment/list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      // await validateUser(fastify, req, res)
      const data: any = req.query
      data.size = parseInt(data.size, 10)
      data.page = parseInt(data.page, 10)
      const result = await getCommentsList(fastify, data)
      return createRequestReturn(200, result as Comment[], '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.delete(
    '/comments',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req, res)
        const data = req.body as CommentsDelete
        data.userId = req.session.userId;
        const result = await deleteComment(fastify, data)
        return createRequestReturn(200, result, '')
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
export interface CommentsDelete {
  commentId: string
  blogId?: string
  shuoshuoId?: string
  personalId?: string // 只要不是null和undefined就行
}