import { FastifyInstance } from 'fastify'
import lodash from 'lodash'
import { CommentsCreate, CommentsDelete } from './comments'
import { createBlogComment, deleteBlogComment } from 'src/routes/blogs/blogFn'
import { createShuoshuoComment, deleteShuoshuoComment } from 'src/routes/shuoshuos/shuoshuoFn'
import { createPersonalComment, deletePersonalComment } from 'src/routes/personal/infoFn'

const { isNil } = lodash
export async function postComment(
  fastify: FastifyInstance,
  data: CommentsCreate
): Promise<any> {
  const params = { comment: data.comment, userId: data.userId }
  if (data.blogId) {
    return await createBlogComment(fastify, { blogId: data?.blogId, ...params })
  } else if (data.shuoshuoId) {
    return await createShuoshuoComment(fastify, { shuoshuoId: data?.shuoshuoId, ...params })
  } else if (data.personalId) {
    return await createPersonalComment(fastify, { personalId: data.personalId, ...params })
  }
}

export async function deleteComment(
  fastify: FastifyInstance,
  data: CommentsDelete
): Promise<any> {
  const params = { commentId: data.commentId }
  if (data.blogId) {
    return await deleteBlogComment(fastify, { blogId: data?.blogId, ...params })
  } else if (data.shuoshuoId) {
    return await deleteShuoshuoComment(fastify, { shuoshuoId: data?.shuoshuoId, ...params })
  } else if (data.personalId) {
    return await deletePersonalComment(fastify, { personalId: data.personalId, ...params })
  }
}
