import { FastifyInstance } from 'fastify'

export async function getUserById(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.user.findUnique({
    where: { id: id }
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
  data: any
): Promise<any> {
  // if ('name' in data) {
  // }
  // if ('is_subscribed' in data) {
  // }
  // if ('is_banned' in data) {
  // }
  return await getUserById(fastify, data.id)
}
