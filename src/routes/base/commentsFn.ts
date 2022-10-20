import { FastifyInstance } from 'fastify'
import { CommentsCreate } from './comments'
import { v4 } from 'uuid'

export async function postComments(
  fastify: FastifyInstance,
  data: CommentsCreate
): Promise<any> {
  const mission = []
  const commentId = v4()
  if ('shuoshuo_id' in data && data.shuoshuo_id !== null) {
    const shuoshuo = await fastify.prisma.shuoshuo.findUnique({
      where: {
        id: data.shuoshuo_id
      }
    })
    if (shuoshuo !== null) {
      mission.push(
        fastify.prisma.shuoshuo.update({
          where: { id: data.shuoshuo_id },
          data: {
            comments_count: shuoshuo.comments_count + 1
          }
        })
      )
    }
  } else if ('blog_id' in data && data.blog_id !== null) {
    const blog = await fastify.prisma.blog.findUnique({
      where: {
        id: data.blog_id
      }
    })
    if (blog !== null) {
      mission.push(
        fastify.prisma.blog.update({
          where: { id: data.blog_id },
          data: {
            comments_count: blog.comments_count + 1
          }
        })
      )
    }
  }
  mission.push(
    fastify.prisma.comment.create({
      data: {
        ...data,
        id: commentId
      }
    })
  )
  await fastify.prisma.$transaction(mission)
  return await fastify.prisma.comment.findUnique({
    where: { id: commentId }
  })
}

export async function deleteComments(
  fastify: FastifyInstance,
  data: {
    id?: number
    blog_id?: string
    shuoshuo_id?: string
    personal_id?: string
  }
): Promise<any> {
  if (data.personal_id !== undefined && data.personal_id !== null) {
    const personal = await fastify.prisma.personal.findFirst()
    data.personal_id = personal?.id
  }
  return await fastify.prisma.comment.deleteMany({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    where: data
  })
}
