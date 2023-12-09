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
  // const mission = []
  // const commentId = v4()
  // if ('shuoshuo_id' in data && data.shuoshuo_id !== null) {
  //   const shuoshuo = await fastify.prisma.shuoshuo.findUnique({
  //     where: {
  //       id: data.shuoshuo_id
  //     }
  //   })
  //   if (shuoshuo !== null) {
  //     mission.push(
  //       fastify.prisma.shuoshuo.update({
  //         where: { id: data.shuoshuo_id },
  //         data: {
  //           comments_count: shuoshuo.comments_count + 1
  //         }
  //       })
  //     )
  //   }
  // } else if ('blog_id' in data && data.blog_id !== null) {
  //   const blog = await fastify.prisma.blog.findUnique({
  //     where: {
  //       id: data.blog_id
  //     }
  //   })
  //   if (blog !== null) {
  //     mission.push(
  //       fastify.prisma.blog.update({
  //         where: { id: data.blog_id },
  //         data: {
  //           comments_count: blog.comments_count + 1
  //         }
  //       })
  //     )
  //   }
  // }
  // mission.push(
  //   fastify.prisma.comment.create({
  //     data: {
  //       ...data,
  //       id: commentId
  //     }
  //   })
  // )
  // await fastify.prisma.$transaction(mission)
  // return await fastify.prisma.comment.findUnique({
  //   where: { id: commentId }
  // })
}

export async function deleteComment(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.comment.update({
    where: { id },
    data: {
      user: {
        disconnect: true
      },
      blog: {
        disconnect: true
      },
      personal: {
        disconnect: true
      },
      shuoshuo: {
        disconnect: true
      }
    }
  })
  // const mission = []
  // mission.push(fastify.prisma.user.update({
  //   where: { id: data.userId },
  //   data: {
  //     comments: {
  //       disconnect: [{ id: data.commentId }]
  //     }
  //   }
  // }))
  // const comment = await fastify.prisma.comment.findUnique({
  //   where: { id: data.commentId }
  // })
  // const commentObj: any = {
  //   data: {
  //     user: {
  //       disconnect: true
  //     }
  //   }
  // }
  // if (!isNil(data.personalId)) {
  //   commentObj.data.personal = {
  //     disconnect: true
  //   }
  //   commentObj.include.personal = true
  // } else if (!isNil(data.blogId)) {
  //   commentObj.data.blog = {
  //     connect: true
  //   }
  //   commentObj.include.blog = true
  // } else if (!isNil(data.shuoshuoId)) {
  //   commentObj.data.shuoshuo = {
  //     connect: true
  //   }
  //   commentObj.include.shuoshuo = true
  // }
  // return await fastify.prisma.comment.update(commentObj)
  // if (data.personal_id !== undefined && data.personal_id !== null) {
  //   const personal = await fastify.prisma.personal.findFirst()
  //   data.personal_id = personal?.id
  // }
  // return await fastify.prisma.comment.deleteMany({
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-expect-error
  //   where: data
  // })
}
