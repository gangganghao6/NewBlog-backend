import { FastifyInstance } from 'fastify'

export async function getUserById(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.user.findUnique({
    where: { id }
  })
}

export async function getUserByEmail(
  fastify: FastifyInstance,
  email: string
): Promise<any> {
  return await fastify.prisma.user.findFirst({
    where: { email }
  })
}

export async function createUser(
  fastify: FastifyInstance,
  data: { email: string; name: string }
): Promise<any> {
  return await fastify.prisma.user.create({
    data
  })
}

export async function putUser(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  return await fastify.prisma.user.update({
    where: { id },
    data
  })
}

export async function getUserAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.user.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      created_time: data.sort
    },
    where: {
      is_subscribed: data.is_subscribed,
      is_banned: data.is_banned
    }
  })
}

export async function getUserDetail(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const user = await getUserById(fastify, id)
  const chats = await fastify.prisma.chat.findMany({
    where: {
      user_id: id
    }
  })
  const userVisits = await fastify.prisma.userVisit.findMany({
    where: { user_id: id }
  })
  const comments = await fastify.prisma.comment.findMany({
    where: { user_id: id }
  })
  const pays = await fastify.prisma.pay.findMany({
    where: { user_id: id }
  })
  return {
    ...user,
    chats,
    user_visit: userVisits,
    comments,
    pays
  }
}
