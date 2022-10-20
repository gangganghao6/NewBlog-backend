import { Prisma } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { RootLogin, RootModify, RootRegist } from './root'

export async function rootLogin(
  fastify: FastifyInstance,
  data: RootLogin
): Promise<any> {
  const RootWhereInput = Prisma.validator<Prisma.RootWhereInput>()({
    OR: [
      {
        account: data.account,
        password: data.password
      },
      {
        email: data.email,
        password: data.password
      }
    ]
  })
  return await fastify.prisma.root.findFirst({
    where: RootWhereInput,
    select: {
      id: true,
      account: true,
      email: true
    }
  })
}

export async function rootRegist(
  fastify: FastifyInstance,
  data: RootRegist
): Promise<any> {
  const RootWhereInput = Prisma.validator<Prisma.RootCreateInput>()({
    email: data.email,
    account: data.account,
    password: data.password
  })
  const exist = await fastify.prisma.root.findFirst({
    where: {
      OR: [{ email: data.email }, { account: data.account }]
    }
  })
  if (exist !== null) {
    throw new Error('账号已存在')
  }
  return await fastify.prisma.root.create({
    data: RootWhereInput
  })
}

export async function rootModify(
  fastify: FastifyInstance,
  data: RootModify
): Promise<any> {
  const myRoot = await fastify.prisma.root.findFirstOrThrow({
    where: {
      id: data.id
    }
  })
  if (myRoot.password !== data.old_password) {
    throw new Error('原密码错误')
  }
  return await fastify.prisma.root.update({
    data: {
      password: data.new_password
    },
    where: {
      id: data.id
    },
    select: {
      id: true,
      account: true,
      email: true
    }
  })
}

export async function getRootById(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.root.findUnique({
    where: { id }
  })
}
