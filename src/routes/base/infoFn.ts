import { FastifyInstance } from 'fastify'
import { BaseInfo } from '../../types/model'
import { v4 } from 'uuid'

export async function getBaseInfo(
  fastify: FastifyInstance,
  baseInfo: any
): Promise<any> {
  const headImage = await fastify.prisma.image.findFirst({
    where: {
      baseinfo_id: baseInfo.id
    }
  })
  return {
    ...baseInfo,
    head_image: headImage
  }
}

export async function postBaseInfo(
  fastify: FastifyInstance,
  data: BaseInfo
): Promise<any> {
  const headImageId = v4()
  const baseInfoId = v4()
  const mission = []
  mission.push(
    fastify.prisma.image.create({
      data: {
        id: headImageId,
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
  return {
    head_image: result[0],
    base_info: result[1]
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
  return await fastify.prisma.$transaction(mission)
}
