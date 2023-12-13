import { FastifyInstance } from 'fastify'
import { CommentsCreate } from './comments'
import lodash from 'lodash'

const { isNil } = lodash
export async function postComment(
  fastify: FastifyInstance,
  data: CommentsCreate
): Promise<any> {
  const commentObj: any = {
    data: {
      comment: data.comment,
      user: {
        connect: {
          id: data.userId
        }
      }
    },
    include: {
      user: true
    }
  }
  if (!isNil(data.personalId)) {
    commentObj.data.personal = {
      connect: {
        id: data.personalId
      }
    }
  } else if (!isNil(data.blogId)) {
    commentObj.data.blog = {
      connect: {
        id: data.blogId
      }
    }
  } else if (!isNil(data.shuoshuoId)) {
    commentObj.data.shuoshuo = {
      connect: {
        id: data.shuoshuoId
      }
    }
  }
  return await fastify.prisma.comment.create(commentObj)
}

export async function deleteComment(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.comment.delete({
    where: { id }
  })
  // return await fastify.prisma.comment.update({
  //   where: { id },
  //   data: {
  //     user: {
  //       disconnect: true
  //     },
  //     blog: {
  //       disconnect: true
  //     },
  //     personal: {
  //       disconnect: true
  //     },
  //     shuoshuo: {
  //       disconnect: true
  //     }
  //   }
  // })
}
