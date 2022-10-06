import { FastifyInstance } from 'fastify'
import { v4 } from 'uuid'

export async function uploadShareFile(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const mission = []
  const shareFileId = v4()
  const videoId = v4()
  switch (data.media_class) {
    case 'images':
      mission.push(
        fastify.prisma.image.create({
          data: {
            sharefile_id: shareFileId,
            name: data.name,
            url: data.url,
            size: data.size
          }
        })
      )
      break
    case 'videos':
      mission.push(
        fastify.prisma.image.create({
          data: { ...data.post, video_id: videoId }
        })
      )
      mission.push(
        fastify.prisma.video.create({
          data: {
            id: videoId,
            sharefile_id: shareFileId,
            name: data.name,
            url: data.url,
            size: data.size,
            duration: data.duration
          }
        })
      )
      break
    case 'files':
      mission.push(
        fastify.prisma.file.create({
          data: {
            name: data.name,
            size: data.size,
            url: data.url
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
  return await fastify.prisma.$transaction(mission)
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
): Promise<any[]> {
  let tempResult
  if (!('type' in data) || data.type === null) {
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
  return finalResult
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
          video,
          post
        }
      }
      break
    case 'files':
      result = {
        file: await fastify.prisma.file.findFirst({
          where: {
            sharefile_id: id
          }
        })
      }
      break
  }
  return {
    share_file: data,
    file: result
  }
}
