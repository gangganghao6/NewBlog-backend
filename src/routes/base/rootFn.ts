import { Prisma } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { RootLogin, RootModify, RootRegist } from './root'
import CryptoJS from 'crypto-js'

export async function rootLogin(
  fastify: FastifyInstance,
  data: RootLogin
): Promise<any> {
  const password = CryptoJS.AES.decrypt(
    data.password,
    process.env.CRYPTO_KEY
  ).toString(CryptoJS.enc.Utf8)
  const RootWhereInput = Prisma.validator<Prisma.RootWhereInput>()({
    OR: [
      {
        account: data.account === undefined ? '' : data.account,
        password
      },
      {
        email: data.account === undefined ? '' : data.account,
        password
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
  const password = CryptoJS.AES.decrypt(
    data.password,
    process.env.CRYPTO_KEY
  ).toString(CryptoJS.enc.Utf8)
  const RootWhereInput = Prisma.validator<Prisma.RootCreateInput>()({
    email: data.email,
    account: data.account,
    password
  })
  const exist = await fastify.prisma.root.findFirst({
    where: {
      OR: [
        { email: data.email === undefined ? '' : data.email },
        { account: data.account === undefined ? '' : data.account }
      ]
    }
  })
  if (exist !== null) {
    throw new Error('账号或邮箱已存在')
  }
  const result = await fastify.prisma.root.create({
    data: RootWhereInput
  })
  return await fastify.prisma.root.findUnique({
    where: { id: result.id },
    select: {
      id: true,
      account: true,
      email: true
    }
  })
}

export async function rootModify(
  fastify: FastifyInstance,
  data: RootModify
): Promise<any> {
  const oldPassword = CryptoJS.AES.decrypt(
    data.old_password,
    process.env.CRYPTO_KEY
  ).toString(CryptoJS.enc.Utf8)
  const newPassword = CryptoJS.AES.decrypt(
    data.new_password,
    process.env.CRYPTO_KEY
  ).toString(CryptoJS.enc.Utf8)
  const myRoot = await fastify.prisma.root.findFirstOrThrow({
    where: {
      id: data.id
    }
  })
  if (myRoot.password !== oldPassword) {
    throw new Error('原密码错误')
  }
  return await fastify.prisma.root.update({
    data: {
      password: newPassword
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
