import info from './base/info'
import comments from './base/comments'
import { FastifyInstance } from 'fastify'
import root from './base/root'

export default async function (
  fastify: FastifyInstance,
  options: { prefix: string }
): Promise<any> {
  await fastify.register(info)
  await fastify.register(comments)
  await fastify.register(root, { prefix: '/root' })
}
