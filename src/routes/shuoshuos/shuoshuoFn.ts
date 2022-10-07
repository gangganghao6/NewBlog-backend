import { FastifyInstance } from 'fastify'
import { v4 } from 'uuid'

export async function postShuoshuo(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const shuoshuoId = v4()
  const mission = []
  switch (data.media_class) {
    case 'images':
      for (const image of data.images) {
        mission.push(
          fastify.prisma.image.create({
            data: {
              name: image.name,
              size: image.size,
              url: image.url,
              shuoshuo_id: shuoshuoId
            }
          })
        )
      }
      break
    case 'video': {
      const videoId = v4()
      mission.push(
        fastify.prisma.image.create({
          data: {
            name: data.video.post.name,
            url: data.video.post.url,
            size: data.video.post.size,
            video_id: videoId
          }
        })
      )
      mission.push(
        fastify.prisma.video.create({
          data: {
            shuoshuo_id: shuoshuoId,
            name: data.video.name,
            url: data.video.url,
            size: data.video.size,
            duration: data.video.duration,
            id: videoId
          }
        })
      )
      break
    }
  }
  mission.push(
    fastify.prisma.shuoshuo.create({
      data: {
        media_class: data.media_class,
        content: data?.content,
        id: shuoshuoId
      }
    })
  )
  return await fastify.prisma.$transaction(mission)
}

export async function getShuoshuo(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const shuoshuo: any = await fastify.prisma.shuoshuo.findFirst({
    where: {
      id
    }
  })
  switch (shuoshuo.media_class) {
    case 'images':
      {
        const images = await fastify.prisma.image.findMany({
          where: {
            shuoshuo_id: id
          }
        })
        shuoshuo.images = images
      }
      break
    case 'video':
      {
        const video = await fastify.prisma.video.findFirst({
          where: {
            shuoshuo_id: id
          }
        })
        const post = await fastify.prisma.image.findFirst({
          where: {
            video_id: video?.id
          }
        })
        shuoshuo.video = {
          ...video,
          post
        }
      }
      break
  }
  const comments = await fastify.prisma.comment.findMany({
    where: {
      shuoshuo_id: id
    }
  })
  shuoshuo.comments = comments
  return shuoshuo
}

export async function getShuoshuoList(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const tempResult = await fastify.prisma.shuoshuo.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    select: {
      id: true
    },
    orderBy: {
      created_time: data.sort
    }
  })
  const result = []
  for (const obj of tempResult) {
    result.push(await getShuoshuo(fastify, obj.id))
  }
  return result
}

export async function deleteShuoshuo(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const shuoshuo = await getShuoshuo(fastify, id)
  const mission = []
  switch (shuoshuo.media_class) {
    case 'images':
      mission.push(
        fastify.prisma.image.deleteMany({
          where: {
            shuoshuo_id: id
          }
        })
      )
      break
    case 'video':
      {
        const video = await fastify.prisma.video.findFirst({
          where: { shuoshuo_id: id }
        })
        mission.push(
          fastify.prisma.video.delete({
            where: { id: video?.id }
          })
        )
        mission.push(
          fastify.prisma.image.deleteMany({
            where: { video_id: video?.id }
          })
        )
      }
      break
  }
  mission.push(
    fastify.prisma.comment.deleteMany({
      where: { shuoshuo_id: id }
    })
  )
  mission.push(
    fastify.prisma.shuoshuo.delete({
      where: { id }
    })
  )
  return await fastify.prisma.$transaction(mission)
}

export async function putShuoshuo(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  const mission = []
  if ('content' in data) {
    mission.push(
      fastify.prisma.shuoshuo.update({
        where: { id },
        data: {
          content: data.content
        }
      })
    )
  }
  if ('images' in data) {
    mission.push(
      fastify.prisma.image.deleteMany({
        where: {
          shuoshuo_id: id
        }
      })
    )
    for (const image of data.images) {
      mission.push(
        fastify.prisma.image.create({
          data: {
            name: image.name,
            size: image.size,
            url: image.url,
            shuoshuo_id: id
          }
        })
      )
    }
  }
  if ('video' in data) {
    const video = await fastify.prisma.video.findFirst({
      where: { shuoshuo_id: id }
    })
    mission.push(
      fastify.prisma.image.deleteMany({
        where: {
          video_id: video?.id
        }
      })
    )
    mission.push(
      fastify.prisma.video.delete({
        where: {
          id: video?.id
        }
      })
    )
    const videoId = v4()
    mission.push(
      fastify.prisma.image.create({
        data: {
          name: data.video.post.name,
          url: data.video.post.url,
          size: data.video.post.size,
          video_id: videoId
        }
      })
    )
    mission.push(
      fastify.prisma.video.create({
        data: {
          id: videoId,
          shuoshuo_id: id,
          name: data.video.name,
          url: data.video.url,
          size: data.video.size,
          duration: data.video.duration
        }
      })
    )
  }
  if ('media_class' in data) {
    mission.push(
      fastify.prisma.shuoshuo.update({
        where: { id },
        data: {
          media_class: data.media_class
        }
      })
    )
  }
  await fastify.prisma.$transaction(mission)
  return await getShuoshuo(fastify, id)
}
