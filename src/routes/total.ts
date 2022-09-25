import info from './base/info'
import comments from './base/comments'
import { FastifyInstance } from 'fastify'
import root from './base/root'
import file_chunk from './files/file_chunk'

export async function BaseRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(info)
  await fastify.register(comments)
  await fastify.register(root, { prefix: '/root' })
}

export async function FilesRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(file_chunk)
}
