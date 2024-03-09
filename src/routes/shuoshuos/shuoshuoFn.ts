import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import lodash, { update } from 'lodash'
import { removeObjNullUndefined } from 'src/utils'

const { isNil } = lodash

export async function postShuoshuo(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const postObj: any = {
    data: {
      content: data.content,
      ...(data?.videos?.length > 0 && {
        videos: {
          create: data.videos.map((item: any) => {
            return {
              ...item,
              post: {
                create: item.post
              }
            }
          })
        }
      }),
      ...(data?.images?.length > 0 && {
        images: {
          create: data.images.map((item: any) => {
            delete item.uid
            return item
          })
        }
      }),
    },
    include: {
      comments: true,
      videos: {
        include: {
          post: true
        }
      },
      images: true
    }
  }
  return await fastify.prisma.shuoshuo.create(postObj)
}

export async function getShuoshuo(
  fastify: FastifyInstance,
  id: string,
  update = false
): Promise<any> {
  const shuoshuo: any = await fastify.prisma.shuoshuo.findFirst({
    where: {
      id
    },
    include: {
      videos: {
        include: {
          post: true
        }
      },
      images: true,
      comments: true
    }
  })
  if (update && !isNil(shuoshuo)) {
    // setImmediate(() => {
    fastify.prisma.shuoshuo
      .update({
        where: { id },
        data: {
          visitedCount: {
            increment: 1
          }
        }
      })
      .then()
      .catch((err) => fastify.log.error(err))
    // })
  }
  return shuoshuo
}

export async function getShuoshuoList(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const countObj = {
    where: {
      id: {
        contains: data.id
      },
      content: {
        contains: data.content
      },
      createdTime: data.createdTimeFrom && {
        gte: dayjs(data.createdTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.createdTimeTo).add(32, 'hour').toDate(),
      },
      lastModifiedTime: data.lastModifiedTimeFrom && {
        gte: dayjs(data.lastModifiedTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.lastModifiedTimeTo).add(32, 'hour').toDate(),
      }
    }
  }
  const searchObj = {
    ...countObj,
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      createdTime: data.sort
    },
    include: {
      videos: {
        include: {
          post: true
        }
      },
      images: true,
      comments: true
    }
  }
  const count = await fastify.prisma.shuoshuo.count(countObj)

  const result = await fastify.prisma.shuoshuo.findMany(searchObj)
  return { result, count }
}

export async function deleteShuoshuo(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.shuoshuo.delete({
    where: { id }
  })
}

export async function putShuoshuo(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  return await fastify.prisma.shuoshuo.update({
    where: { id },
    data: {
      ...data,
      lastModifiedTime: new Date(),
      videos: {
        deleteMany: {},
        create:
          data?.videos?.map((e: any) => {
            e = removeObjNullUndefined(e)
            delete e.id
            delete e.shuoshuoId
            delete e.uid
            delete e.post.videoId
            delete e.post.uid
            delete e.post.id
            return {
              ...e,
              post: {
                create: removeObjNullUndefined(e.post)
              }
            }
          }) ?? []
      },
      images: {
        deleteMany: {},
        create: data?.images?.map((e: any) => {
          delete e.id
          delete e.shuoshuoId
          delete e.uid
          return removeObjNullUndefined(e)
        }) ?? []
      },
      comments: {
        deleteMany: {},
        create: data.comments ?? []
      }
    },
    include: {
      videos: {
        include: {
          post: true
        }
      },
      images: true,
      comments: true
    }
  })
}
