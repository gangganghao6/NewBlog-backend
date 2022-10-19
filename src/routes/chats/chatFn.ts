import { FastifyInstance } from 'fastify'
import { v4 } from 'uuid'

export async function sendMessage(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const tempData: any = {}
  const mission = []
  const chatId = v4()
  switch (data.media_class) {
    case 'text':
      tempData.content = data.content
      break
    case 'image':
      mission.push(
        fastify.prisma.image.create({
          data: { ...data.image, chat_id: chatId }
        })
      )
      break
    case 'video':
      {
        const videoId = v4()
        mission.push(
          fastify.prisma.image.create({
            data: { ...data.video.post, video_id: videoId }
          })
        )
        mission.push(
          fastify.prisma.video.create({
            data: {
              name: data.video.name,
              url: data.video.url,
              size: data.video.size,
              duration: data.video.duration,
              chat_id: chatId
            }
          })
        )
      }
      break
    case 'file':
      mission.push(
        fastify.prisma.file.create({
          data: { ...data.file, chat_id: chatId }
        })
      )
      break
  }
  mission.push(
    fastify.prisma.chat.create({
      data: {
        id: chatId,
        ip: data.ip,
        location: data.location,
        user_id: data.user_id,
        media_class: data.media_class
      }
    })
  )
  return await fastify.prisma.$transaction(mission)
}

export async function getChatAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  let temps: any[], tempCount: number
  const result = []
  if ('user_id' in data && data.user_id !== null) {
    tempCount = await fastify.prisma.chat.count({
      where: {
        user_id: data.user_id
      }
    })
    temps = await fastify.prisma.chat.findMany({
      take: data.size,
      skip: (data.page - 1) * data.size,
      orderBy: {
        created_time: data.sort
      },
      where: {
        user_id: data.user_id
      },
      select: {
        id: true
      }
    })
  } else {
    tempCount = await fastify.prisma.chat.count()
    temps = await fastify.prisma.chat.findMany({
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
  for (const temp of temps) {
    result.push(await getChat(fastify, temp.id))
  }
  return { result, count: tempCount }
}

async function getChat(fastify: FastifyInstance, id: string): Promise<any> {
  const chat: any = await fastify.prisma.chat.findUnique({
    where: { id }
  })
  if (chat !== null && chat.media_class === 'image') {
    chat.image = await fastify.prisma.image.findFirst({
      where: { chat_id: chat.id }
    })
  } else if (chat !== null && chat.media_class === 'video') {
    chat.video = await fastify.prisma.video.findFirst({
      where: { chat_id: chat.id }
    })
    chat.video.post = await fastify.prisma.image.findFirst({
      where: { video_id: chat.video.id }
    })
  } else if (chat !== null && chat.media_class === 'file') {
    chat.file = await fastify.prisma.file.findFirst({
      where: { chat_id: chat.id }
    })
  }
  return chat
}

export async function deleteChat(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const mission = []
  const chat = await fastify.prisma.chat.findFirst({
    where: { id }
  })
  if (chat !== null && chat.media_class === 'image') {
    mission.push(
      fastify.prisma.image.deleteMany({
        where: { chat_id: id }
      })
    )
  } else if (chat !== null && chat.media_class === 'video') {
    const video = await fastify.prisma.video.findFirst({
      where: { chat_id: id }
    })
    mission.push(
      fastify.prisma.image.deleteMany({
        where: { video_id: video?.id }
      })
    )
    mission.push(
      fastify.prisma.video.deleteMany({
        where: { chat_id: id }
      })
    )
  } else if (chat !== null && chat.media_class === 'file') {
    mission.push(
      fastify.prisma.file.deleteMany({
        where: { chat_id: id }
      })
    )
  }
  mission.push(
    fastify.prisma.chat.delete({
      where: { id }
    })
  )
  return await fastify.prisma.chat.delete({
    where: { id }
  })
}

export async function deleteUserChatAll(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const results = []
  const temps = await fastify.prisma.chat.findMany({
    where: {
      user_id: id
    },
    select: {
      id: true
    }
  })
  for (const temp of temps) {
    results.push(await deleteChat(fastify, temp.id))
  }
  return results
}
