import { FastifyInstance } from 'fastify'

export async function sendMessage(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const tempData: any = {}
  switch (data.media_class) {
    case 'text':
      tempData.content = data.content
      break
    case 'image':
      tempData.image_id = data.image_id
      break
    case 'video':
      tempData.video_id = data.video_id
      break
    case 'file':
      tempData.file_id = data.file_id
      break
  }
  return await fastify.prisma.chat.create({
    data: {
      ip: data.ip,
      location: data.location,
      user_id: data.user_id,
      media_class: data.media_class,
      ...tempData
    }
  })
}

export async function getChatAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  if ('user_id' in data && data.user_id !== null) {
    return await fastify.prisma.chat.findMany({
      take: data.size,
      skip: (data.page - 1) * data.size,
      orderBy: {
        created_time: data.sort
      },
      where: {
        user_id: data.user_id
      }
    })
  } else {
    return await fastify.prisma.chat.findMany({
      take: data.size,
      skip: (data.page - 1) * data.size,
      orderBy: {
        created_time: data.sort
      }
    })
  }
}

export async function deleteChat(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.chat.delete({
    where: { id }
  })
}

export async function deleteUserChatAll(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.chat.deleteMany({
    where: {
      user_id: id
    }
  })
}
