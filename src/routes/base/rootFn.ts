import { Prisma } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { Root } from '../../types/model'

export async function rootLogin(
  fastify: FastifyInstance,
  data: Root
): Promise<boolean> {
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
  const result = await fastify.prisma.root.findFirst({
    where: RootWhereInput
  })
  return result !== null
}

export async function rootRegist(
  fastify: FastifyInstance,
  data: Root
): Promise<Root> {
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
  data: Root & { old_password: string; new_password: string }
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
