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
  await fastify.register(BaseRoute, { prefix: '/api/base' })
  await fastify.register(FilesRoute, { prefix: '/api/files' })
  await fastify.register(ShareFilesRoute, { prefix: '/api/share_files' })
  await fastify.register(BlogsRoute, { prefix: '/api/blogs' })
  await fastify.register(UsersRoute, { prefix: '/api/users' })
  await fastify.register(ShuoshuosRoute, { prefix: '/api/shuoshuos' })
  await fastify.register(PersonalRoute, { prefix: '/api/personal' })
  await fastify.register(TodolistRoute, { prefix: '/api/todolists' })
  await fastify.register(GithubRoute, { prefix: '/api/githubs' })
  await fastify.register(ChatRoute, { prefix: '/api/chats' })
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
