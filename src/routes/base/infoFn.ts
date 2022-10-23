import { FastifyInstance } from 'fastify'
import { v4 } from 'uuid'
import { BaseInfoCreate } from './info'
import { BaseInfo } from '../../types/model'

export async function getBaseInfo(
  fastify: FastifyInstance,
  baseInfo: BaseInfo
): Promise<any> {
  const headImage = await fastify.prisma.image.findFirst({
    where: {
      baseinfo_id: baseInfo.id
    }
  })
  const blogsCount = await fastify.prisma.blog.count()
  const commentsCount = await fastify.prisma.comment.count()
  setImmediate(() => {
    void fastify.prisma.baseInfo
      .update({
        where: { id: baseInfo.id },
        data: {
          visits_count: baseInfo.visits_count + 1
        }
      })
      .then()
      .catch((err) => fastify.log.error(err))
  })
  return {
    ...baseInfo,
    head_image: headImage,
    blogs_count: blogsCount,
    comments_count: commentsCount
  }
}

export async function postBaseInfo(
  fastify: FastifyInstance,
  data: BaseInfoCreate
): Promise<any> {
  const baseInfoId = v4()
  const mission = []
  mission.push(
    fastify.prisma.image.create({
      data: {
        name: data.head_image.name,
        url: data.head_image.url,
        baseinfo_id: baseInfoId,
        size: data.head_image.size
      }
    })
  )
  mission.push(
    fastify.prisma.baseInfo.create({
      data: {
        id: baseInfoId,
        name: data.name
      }
    })
  )
  const result = await fastify.prisma.$transaction(mission)
  const headImage = result[0]
  const baseInfo = result[1]

  return {
    ...baseInfo,
    head_image: headImage
  }
}

export async function putBaseInfo(
  fastify: FastifyInstance,
  data: any,
  baseInfo: any
): Promise<any> {
  const mission = []
  if ('head_image' in data) {
    mission.push(
      fastify.prisma.image.updateMany({
        where: {
          baseinfo_id: baseInfo.id
        },
        data: data.head_image
      })
    )
  }
  if ('name' in data) {
    mission.push(
      fastify.prisma.baseInfo.update({
        where: {
          id: baseInfo.id
        },
        data: {
          name: data.name
        }
      })
    )
  }
  mission.push(
    fastify.prisma.baseInfo.update({
      where: { id: baseInfo.id },
      data: { last_modified_time: new Date() }
    })
  )
  await fastify.prisma.$transaction(mission)
  const temp = (await fastify.prisma.baseInfo.findFirst()) as BaseInfo
  return await getBaseInfo(fastify, temp)
}
