import { FastifyInstance } from 'fastify'

export async function sendMessage(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.chat.create({
    data: {
      content: data.content,
      ip: data.ip,
      location: data.location,
      image: {
        create: data.image
      },
      video: {
        create: data.video
      },
      file: {
        create: data.file
      },
      user: {
        connect: {
          id: data.userId
        }
      }
    }
  })
}

export async function getChatAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.chat.findMany({
    include: {
      image: true,
      video: true,
      file: true,
      user: true
    },
    skip: data.size * (data.page - 1),
    take: data.size
  })
}

// async function getChat(fastify: FastifyInstance, id: string): Promise<any> {
//   return await fastify.prisma.chat.findUnique({
//     where: { id },
//     include: {
//       image: true,
//       video: true,
//       file: true
//     }
//   })
// }

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
    where: { userId: id }
  })
}
