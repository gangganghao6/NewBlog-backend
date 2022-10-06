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
