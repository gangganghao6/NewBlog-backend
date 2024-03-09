import { Prisma } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { RootLogin, RootLoginReturn, RootModify, RootRegist } from './root'
import CryptoJS from 'crypto-js'
import dayjs from 'dayjs'

export async function rootLogin(
  fastify: FastifyInstance,
  data: RootLogin
): Promise<RootLoginReturn> {
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
  const tempResult: RootLoginReturn = await fastify.prisma.root.findFirst({
    where: RootWhereInput,
    select: {
      id: true,
    }
  })
  const result = await fastify.prisma.root.update({
    where: {
      id: tempResult.id
    },
    data: {
      lastLoginTime: new Date()
    },
    select: {
      id: true,
      account: true,
      email: true,
      name: true,
      lastLoginTime: true
    }
  })
  return result
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
    password,
    name: data.name
  })
  const exist = await fastify.prisma.root.findFirst({
    where: {
      OR: [
        { email: data.email === undefined ? '' : data.email },
        { account: data.account === undefined ? '' : data.account },
        { name: data.name === undefined ? '' : data.name }
      ]
    }
  })
  if (exist !== null) {
    throw new Error('账号、邮箱或名字已存在')
  }
  const result = await fastify.prisma.root.create({
    data: RootWhereInput
  })
  return await fastify.prisma.root.findUnique({
    where: { id: result.id },
    select: {
      id: true,
      account: true,
      email: true,
      name: true
    }
  })
}

export async function rootModify(
  fastify: FastifyInstance,
  data: RootModify
): Promise<any> {
  const oldPassword = CryptoJS.AES.decrypt(
    data.oldPassword,
    process.env.CRYPTO_KEY
  ).toString(CryptoJS.enc.Utf8)
  const newPassword = CryptoJS.AES.decrypt(
    data.newPassword,
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
    where: { id: id === undefined ? '' : id },
    select: {
      id: true,
      account: true,
      email: true,
      name: true,
      lastLoginTime: true
    }
  })
}
