import { FastifyInstance } from 'fastify'
import { v4 } from 'uuid'

export async function uploadShareFile(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const mission = []
  const shareFileId = v4()
  switch (data.media_class) {
    case 'images':
      mission.push(
        fastify.prisma.image.create({
          data: {
            sharefile_id: shareFileId,
            name: data.image.name,
            url: data.image.url,
            size: data.image.size
          }
        })
      )
      break
    case 'videos':
      {
        const videoId = v4()
        mission.push(
          fastify.prisma.image.create({
            data: {
              video_id: videoId,
              name: data.video.post.name,
              url: data.video.post.url,
              size: data.video.post.size
            }
          })
        )
        mission.push(
          fastify.prisma.video.create({
            data: {
              id: videoId,
              sharefile_id: shareFileId,
              name: data.video.name,
              url: data.video.url,
              size: data.video.size,
              duration: data.video.duration
            }
          })
        )
      }
      break
    case 'files':
      mission.push(
        fastify.prisma.file.create({
          data: {
            name: data.file.name,
            size: data.file.size,
            url: data.file.url,
            sharefile_id: shareFileId
          }
        })
      )
      break
  }
  mission.push(
    fastify.prisma.shareFile.create({
      data: {
        id: shareFileId,
        media_class: data.media_class,
        type: data.type
      }
    })
  )
  await fastify.prisma.$transaction(mission)
  return await getShareFile(fastify, shareFileId)
}

export async function deleteShareFile(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const mission = []
  const target = await fastify.prisma.shareFile.findUnique({
    where: { id }
  })
  mission.push(
    fastify.prisma.shareFile.delete({
      where: { id }
    })
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  switch (target.media_class) {
    case 'images':
      mission.push(
        fastify.prisma.image.deleteMany({
          where: { sharefile_id: id }
        })
      )
      break
    case 'videos':
      // eslint-disable-next-line no-case-declarations
      const temp = await fastify.prisma.video.findFirst({
        where: { sharefile_id: id }
      })

      mission.push(
        fastify.prisma.image.deleteMany({
          where: {
            video_id: temp?.id
          }
        })
      )
      mission.push(
        fastify.prisma.video.deleteMany({
          where: { sharefile_id: id }
        })
      )
      break
    case 'files':
      mission.push(
        fastify.prisma.file.deleteMany({
          where: { sharefile_id: id }
        })
      )
      break
  }
  return await fastify.prisma.$transaction(mission)
}

export async function putShareFile(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.shareFile.update({
    where: { id: data.id },
    data: {
      type: data.type
    }
  })
}

export async function getShareFileList(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  let tempResult, tempCount
  if (!('type' in data) || data.type === null) {
    tempCount = await fastify.prisma.shareFile.count()
    tempResult = await fastify.prisma.shareFile.findMany({
      take: data.size,
      skip: (data.page - 1) * data.size,
      orderBy: {
        created_time: data.sort
      },
      select: {
        id: true
      }
    })
  } else {
    tempCount = await fastify.prisma.shareFile.count({
      where: {
        type: {
          equals: data.type
        }
      }
    })
    tempResult = await fastify.prisma.shareFile.findMany({
      where: {
        type: {
          equals: data.type
        }
      },
      take: data.size,
      skip: (data.page - 1) * data.size,
      orderBy: {
        created_time: data.sort
      },
      select: {
        id: true
      }
    })
  }
  const finalResult: any[] = []
  for (const temp of tempResult) {
    finalResult.push(await getShareFile(fastify, temp.id))
  }
  return { result: finalResult, count: tempCount }
}

export async function getShareFile(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const data = (await fastify.prisma.shareFile.findUnique({
    where: { id }
  }))!
  let result
  switch (data.media_class) {
    case 'images':
      result = await fastify.prisma.image.findFirst({
        where: {
          sharefile_id: id
        }
      })
      break
    case 'videos':
      {
        const video = await fastify.prisma.video.findFirst({
          where: {
            sharefile_id: id
          }
        })
        const post = await fastify.prisma.image.findFirst({
          where: { video_id: video?.id }
        })
        result = {
          ...video,
          post
        }
      }
      break
    case 'files':
      result = await fastify.prisma.file.findFirst({
        where: {
          sharefile_id: id
        }
      })
      break
  }
  return {
    share_file: data,
    file: result
  }
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
            download_count: sharefile.download_count + 1
          }
        })
        .then()
        .catch((err) => fastify.log.error(err))
    })
  }
  return null
}
