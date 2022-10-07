import {
  BaseRoute,
  BlogsRoute,
  FilesRoute,
  ShareFilesRoute,
  ShuoshuosRoute,
  UsersRoute
} from './routes/total'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

async function registRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(BaseRoute, { prefix: '/api/base' })
  await fastify.register(FilesRoute, { prefix: '/api/files' })
  await fastify.register(ShareFilesRoute, { prefix: '/api/share_files' })
  await fastify.register(BlogsRoute, { prefix: '/api/blogs' })
  await fastify.register(UsersRoute, { prefix: '/api/users' })
  await fastify.register(ShuoshuosRoute, { prefix: '/api/shuoshuos' })
}

async function registStatic(fastify: FastifyInstance): Promise<void> {
  await fastify.get(
    '/frontend',
    async (req: FastifyRequest, res: FastifyReply) => {
      await res.sendFile('index.html')
    }
  )
}

export { registRoutes, registStatic }
