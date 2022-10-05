import { FastifyInstance } from 'fastify'
import { Comment } from '../../types/model'

export async function postComments(
  fastify: FastifyInstance,
  data: Comment
): Promise<any> {
  return await fastify.prisma.comment.create({
    data: data
  })
}

export async function deleteComments(
  fastify: FastifyInstance,
  data: {
    id: number
    blog_id?: string
    shuoshuo_id?: string
    personal_id?: string
  }
): Promise<any> {
  return await fastify.prisma.comment.deleteMany({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    where: data
  })
}
