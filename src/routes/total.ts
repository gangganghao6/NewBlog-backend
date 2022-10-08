import baseInfo from './base/info'
import comments from './base/comments'
import { FastifyInstance } from 'fastify'
import root from './base/root'
import files from './files/file_chunk'
import share_file from './share_files/share_file'
import blogs from './blogs/blog'
import users from './users/user'
import shuoshuos from './shuoshuos/shuoshuo'
import experience from './personal/experience'
import project from './personal/project'
import personalInfo from './personal/info'

export async function BaseRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(baseInfo)
  await fastify.register(comments)
  await fastify.register(root, { prefix: '/root' })
}

export async function FilesRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(files)
}

export async function ShareFilesRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(share_file)
}

export async function BlogsRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(blogs)
}

export async function UsersRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(users)
}

export async function ShuoshuosRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(shuoshuos)
}

export async function PersonalRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(personalInfo)
  await fastify.register(experience)
  await fastify.register(project)
}
