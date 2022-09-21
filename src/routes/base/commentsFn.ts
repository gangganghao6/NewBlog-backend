import { FastifyInstance } from 'fastify'
import { Prisma } from '@prisma/client'
import { Comment } from '../../types/model'

export async function postComments(
  fastify: FastifyInstance,
  data: Comment
): Promise<Comment[]> {
  const postCommentsCreate = Prisma.validator<Prisma.CommentCreateInput>()({
    user_id: data.user_id,
    comment: data.comment
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return fastify.prisma[data.type].update({
    where: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      id: data[`${data.type}_id`]
    },
    data: {
      comments: {
        create: postCommentsCreate
      }
    },
    select: {
      comments: true
    }
  })
}

export async function deleteComments(
  fastify: FastifyInstance,
  data: {
    id: number
    blog_id?: string
    shuoshuo_id: string
    personal_id: string
    type: 'personal' | 'shuoshuo' | 'blog'
  }
): Promise<Comment[]> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return fastify.prisma[data.type].update({
    where: {
      id: data[`${data.type}_id`]
    },
    data: {
      comments: {
        delete: [{ id: data.id }]
      }
    },
    select: {
      comments: true
    }
  })
}
