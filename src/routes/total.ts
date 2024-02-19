import baseInfo from './admin/base/info'
import comments from './admin/base/comments'
import { FastifyInstance } from 'fastify'
import root from './admin/base/root'
import files from './admin/files/file_chunk'
import share_file from './admin/share_files/share_file'
import blogs from './admin/blogs/blog'
import users from './admin/users/user'
import shuoshuos from './admin/shuoshuos/shuoshuo'
import experience from './admin/personal/experience'
import project from './admin/personal/project'
import personalInfo from './admin/personal/info'
import todolist from './admin/todolists/todolist'
import github from './admin/githubs/github'
import log from './admin/base/log'
import chat from './admin/chats/chat'

export async function BaseRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(baseInfo)
  await fastify.register(comments)
  await fastify.register(root, { prefix: '/root' })
  await fastify.register(log, { prefix: '/urlsInfo' })
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

export async function TodolistRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(todolist)
}

export async function GithubRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(github)
}

export async function ChatRoute(fastify: FastifyInstance): Promise<void> {
  await fastify.register(chat)
}
