import { FastifyInstance } from 'fastify'
import { BaseInfo } from '../../types/model'
import { Prisma } from '@prisma/client'

export async function getBaseInfo(fastify: FastifyInstance): Promise<any> {
  const baseInfoInclude = Prisma.validator<Prisma.BaseInfoInclude>()({
    head_image: {
      select: {
        id: true,
        name: true,
        url: true,
        created_time: true
      }
    }
  })
  const result = await fastify.prisma.baseInfo.findFirst({
    where: {
      id: 1
    },
    include: baseInfoInclude
  })
  if (result === null) {
    return null
  } else {
    return result
  }
}

export async function postBaseInfo(
  fastify: FastifyInstance,
  data: BaseInfo
): Promise<any> {
  const exist = await getBaseInfo(fastify)
  if (exist === null) {
    try {
      const baseInfoCreate = Prisma.validator<Prisma.BaseInfoCreateInput>()({
        name: data.name,
        head_image: {
          create: {
            name: data.head_image.name,
            url: data.head_image.url
          }
        }
      })
      return await fastify.prisma.baseInfo.create({
        data: baseInfoCreate,
        include: {
          head_image: true
        }
      })
    } catch (e) {
      throw new Error('数据格式错误')
    }
  } else {
    throw new Error('博客已初始化')
  }
}

export async function putBaseInfo(
  fastify: FastifyInstance,
  data: BaseInfo
): Promise<any> {
  const exist = await getBaseInfo(fastify)
  if (exist === null) {
    throw new Error('您还未初始化博客信息')
  } else {
    try {
      return await fastify.prisma.baseInfo.update({
        where: { id: 1 },
        data,
        include: {
          head_image: true
        }
      })
    } catch (e) {
      throw new Error('数据格式错误')
    }
  }
}
