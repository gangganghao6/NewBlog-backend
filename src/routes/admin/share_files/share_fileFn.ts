import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { removeObjNullUndefined } from 'src/utils'

export async function uploadShareFile(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.shareFile.create({
    data: {
      ...data,
      ...(data.file && {
        file: {
          create: data.file
        }
      }),
      ...(data.image && {
        image: {
          create: data.image
        }
      }),
      ...(data.video && {
        video: {
          create: {
            ...data.video,
            post: {
              create: data.video.post
            }
          }
        }
      })
    },
    include: {
      file: true,
      image: true,
      video: {
        include: {
          post: true
        }
      }
    }
  })
}

export async function deleteShareFile(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.shareFile.delete({
    where: { id }
  })
}

export async function putShareFile(
  fastify: FastifyInstance,
  { id, data }: any
): Promise<any> {
  delete data?.file?.shareFileId
  delete data?.image?.shareFileId
  delete data?.video?.shareFileId
  delete data?.file?.id
  delete data?.image?.id
  delete data?.video?.id
  delete data?.video?.post?.id
  delete data?.video?.post?.videoId
  const targetShareFile = await getShareFile(fastify, id)

  const result = await fastify.prisma.shareFile.update({
    where: { id },
    data: {
      name: data.name,
      file: {
        ...(targetShareFile?.file && { delete: true }),
        ...(data.file && { create: removeObjNullUndefined(data.file) })
      }
      ,
      image: {
        ...(targetShareFile?.image && { delete: true }),
        ...(data.image && { create: removeObjNullUndefined(data.image) })
      }
      ,
      video: {
        ...(targetShareFile?.video && { delete: true }),
        ...(data.video && {
          create: {
            ...removeObjNullUndefined(data.video),
            post: {
              create: removeObjNullUndefined(data.video.post)
            }
          }
        })
      }
    }
  })
  return result
}

export async function getShareFileList(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const countObj: any = {
    where: {
      id: {
        contains: data.id
      },
      name: {
        contains: data.name
      },
      createdTime: data.createdTimeFrom && {
        gte: dayjs(data.createdTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.createdTimeTo).add(8, 'hour').toDate(),
      },
      lastModifiedTime: data.lastModifiedTimeFrom && {
        gte: dayjs(data.lastModifiedTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.lastModifiedTimeTo).add(8, 'hour').toDate(),
      }
    },
  }
  const searchObj: any = {
    ...countObj,
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      lastModifiedTime: data.sort
    },
    include: {
      file: true,
      image: true,
      video: {
        include: {
          post: true
        }
      }
    }
  }
  const result = await fastify.prisma.shareFile.findMany(searchObj)
  const count = await fastify.prisma.shareFile.count(countObj)
  return { result, count }
}
export async function getShareFile(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.shareFile.findUnique({
    where: { id },
    include: {
      file: true,
      image: true,
      video: {
        include: {
          post: true
        }
      }
    }
  })
}

export async function increaseShareFileDownload(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const sharefile = await fastify.prisma.shareFile.findUnique({
    where: { id }
  })
  if (sharefile !== null) {
    setImmediate(() => {
      void fastify.prisma.shareFile
        .update({
          where: { id },
          data: {
            downloadCount: {
              increment: 1
            }
          }
        })
        .then()
        .catch((err) => fastify.log.error(err))
    })
  }
  return null
}
