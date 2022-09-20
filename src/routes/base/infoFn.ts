import { FastifyInstance } from 'fastify'
import { BaseInfo } from '../../types/model'

export async function getBaseInfo(fastify: FastifyInstance): Promise<any> {
  const result: BaseInfo | null = (await fastify.prisma.baseInfo.findFirst({
    where: {
      id: 1
    },
    include: {
      head_image: {
        select: {
          id: true,
          name: true,
          url: true,
          created_time: true
        }
      }
    }
  })) as unknown as BaseInfo
  if (result === null) {
    return null
  } else {
    return result
  }
}

export async function postBaseInfo(
  fastify: FastifyInstance,
  data: BaseInfo
): Promise<BaseInfo> {
  const exist = await getBaseInfo(fastify)
  if (exist === null) {
    try {
      const result = await fastify.prisma.baseInfo.create({
        data: {
          name: data.name,
          head_image: {
            create: {
              name: data.head_image.name,
              url: data.head_image.url
            }
          }
        },
        include: {
          head_image: true
        }
      })
      return result
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
): Promise<BaseInfo> {
  const exist = await getBaseInfo(fastify)
  if (exist === null) {
    throw new Error('您还未初始化博客信息')
  } else {
    try {
      const result = await fastify.prisma.baseInfo.update({
        where: { id: 1 },
        data,
        include: {
          head_image: true
        }
      })
      return result
    } catch (e) {
      throw new Error('数据格式错误')
    }
  }
}
