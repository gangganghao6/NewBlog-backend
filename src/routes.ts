import {
  BaseRoute,
  BlogsRoute,
  ChatRoute,
  FilesRoute,
  GithubRoute,
  PersonalRoute,
  ShareFilesRoute,
  ShuoshuosRoute,
  TodolistRoute,
  UsersRoute
} from './routes/total'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

async function registRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(BaseRoute, { prefix: '/api/admin/base' })
  await fastify.register(FilesRoute, { prefix: '/api/admin/files' })
  await fastify.register(ShareFilesRoute, { prefix: '/api/admin/share_files' })
  await fastify.register(BlogsRoute, { prefix: '/api/admin/blogs' })
  await fastify.register(UsersRoute, { prefix: '/api/admin/users' })
  await fastify.register(ShuoshuosRoute, { prefix: '/api/admin/shuoshuos' })
  await fastify.register(PersonalRoute, { prefix: '/api/admin/personal' })
  await fastify.register(TodolistRoute, { prefix: '/api/admin/todolists' })
  await fastify.register(GithubRoute, { prefix: '/api/admin/githubs' })
  await fastify.register(ChatRoute, { prefix: '/api/admin/chats' })
}

async function registStatic(fastify: FastifyInstance): Promise<void> {
  await fastify.get(
    '/frontend',
    async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
      await res.sendFile('index.html')
    }
  )
}

export { registRoutes, registStatic }
