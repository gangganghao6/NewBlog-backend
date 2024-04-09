import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { updateBaseInfoLastModified } from 'src/routes/base/infoFn'
import { updateUserLastActiveTime } from 'src/routes/users/userFn'

export async function sendMessage(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  await updateUserLastActiveTime(fastify, data.userId)
  return await fastify.prisma.chat.create({
    data: {
      content: data.content,
      ip: data.ip,
      location: data.location,
      image: {
        create: data.image
      },
      ...(data.video && {
        video: {
          create: {
            ...data.video,
            post: {
              create: {
                ...data.video.post,
              }
            }
          }
        }
      }),
      file: {
        create: data.file
      },
      user: {
        connect: {
          id: data.userId
        }
      }
    },
    include: {
      image: true,
      video: {
        include: {
          post: true
        }
      },
      file: true,
      user: true
    }
  })
}

export async function getChatAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  
  const countObj = {
    where: {
      id: {
        contains: data.id
      },
      userId: {
        contains: data.userId
      },
      user: {
        email: {
          contains: data.email
        },
        name: {
          contains: data.name
        }
      },
      createdTime: data.createdTimeFrom && {
        gte: dayjs(data.createdTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.createdTimeTo).add(32, 'hour').toDate(),
      },
    }
  }
  const searchObj = {
    ...countObj,
    orderBy: {
      createdTime: data.sort
    },
    skip: data.size * (data.page - 1),
    take: data.size,
    include: {
      image: true,
      video: {
        include: {
          post: true
        }
      },
      file: true,
      user: true
    },
  }
  const count = await fastify.prisma.chat.count(countObj)
  const result = await fastify.prisma.chat.findMany(searchObj)
  return { result: data.reverse ? result.reverse() : result, count }
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
export async function getChatDetail(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.chat.findUnique({
    where: { id },
    include: {
      image: true,
      video: {
        include: {
          post: true
        }
      },
      file: true,
      user: true
    }
  })
}
export async function deleteChat(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  await updateBaseInfoLastModified(fastify)
  return await fastify.prisma.chat.delete({
    where: { id }
  })
}

export async function deleteUserChatAll(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  await updateBaseInfoLastModified(fastify)
  return await fastify.prisma.chat.deleteMany({
    where: { userId: id }
  })
}
