import { FastifyInstance } from 'fastify'
import { getExperiencesList } from './experienceFn'
import { getProjectsList } from './projectFn'
import lodash from 'lodash'
import { updateBaseInfoLastModified } from 'src/routes/base/infoFn'
const { isNil } = lodash

export async function putPersonalInfo(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  await updateBaseInfoLastModified(fastify)
  const exist = await fastify.prisma.personal.findFirst()
  if (isNil(exist)) {
    await fastify.prisma.personal.create({
      data: {},
    })
  }
  let result = await fastify.prisma.personal.findFirst({
    select: { id: true }
  })
  result = await fastify.prisma.personal.update({
    where: { id: result?.id },
    data: {
      ...data,
      lastModifiedTime: new Date()
    }
  })
  return result
}

export async function getPersonalInfoAll(
  fastify: FastifyInstance,
  increase: boolean
): Promise<any> {

  const info = await fastify.prisma.personal.findFirst({
    include: {
      pays: {
        include: {
          user: true
        }
      },
      comments: {
        include: {
          user: true
        }
      }
    }
  })
  if (increase) {
    await fastify.prisma.personal.update({
      where: { id: info?.id },
      data: {
        visitedCount: {
          increment: 1
        }
      }
    })
  }
  const experiences = await getExperiencesList(fastify, {
    page: 1,
    size: 99999,
    sort: 'desc'
  })
  const projects = await getProjectsList(fastify, {
    page: 1,
    size: 99999,
    sort: 'desc'
  })
  return { ...info, experiences, projects }
}
export async function createPersonalComment(
  fastify: FastifyInstance,
  data: {
    comment: string
    userId: string,
    personalId: string
  }
): Promise<any> {
  return await fastify.prisma.personal.update({
    where: { id: data.personalId },
    data: {
      comments: {
        create: {
          comment: data.comment,
          user: {
            connect: {
              id: data.userId
            }
          }
        }
      }
    }
  })
}
export async function deletePersonalComment(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.personal.update({
    where: { id: data?.personalId },
    data: {
      comments: {
        delete: {
          id: data.commentId
        }
      }
    }
  })
}