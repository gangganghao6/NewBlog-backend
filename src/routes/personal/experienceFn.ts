import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { gte } from 'lodash'
import { removeObjNullUndefined } from 'src/utils'
import { updateBaseInfoLastModified } from 'src/routes/base/infoFn'

export async function postExperience(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  await updateBaseInfoLastModified(fastify)
  return await fastify.prisma.experience.create({
    data: {
      company: data.company,
      duty: data.duty,
      description: data.description,
      timeStart: dayjs(data.timeStart).add(8, 'hour').toDate(),
      ...(data?.timeEnd && { timeEnd: dayjs(data.timeEnd).add(8, 'hour').toDate() }),
      ...(data?.images && {
        images: {
          create: data.images.map((item: any) => {
            delete item.uid
            delete item.experienceId
            delete item.id
            return item
          })
        }
      })
    },
    include: {
      images: true
    }
  })
}

export async function getExperience(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.experience.findUnique({
    where: { id },
    include: {
      images: true
    }
  })
}

export async function getExperiencesList(
  fastify: FastifyInstance,
  data: any = { page: 1, size: 10, sort: 'desc' }
): Promise<any> {

  const countObj: any = {
    where: {
      id: {
        contains: data.id
      },
      company: {
        contains: data.company
      },
      duty: {
        contains: data.duty
      },
      description: {
        contains: data.description
      },
      timeStart: data.time && {
        lte: dayjs(data.time).add(8, 'hour').toDate(),
      },
      createdTime: data.createdTimeFrom && {
        gte: dayjs(data.createdTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.createdTimeTo).add(32, 'hour').toDate(),
      },
      lastModifiedTime: data.lastModifiedTimeFrom && {
        gte: dayjs(data.lastModifiedTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.lastModifiedTimeTo).add(32, 'hour').toDate(),
      }
    },
  }
  const searchObj: any = {
    ...countObj,
    orderBy: {
      lastModifiedTime: data.sort
    },
    include: {
      images: true,
    }
  }
  let tempResult = await fastify.prisma.experience.findMany(searchObj)
  if (data.time) {
    tempResult = tempResult.filter((item: any) => {
      if (item.timeEnd) {
        return dayjs(data.time).isBefore(dayjs(item.timeEnd))
      } else {
        return true
      }
    })
  }
  const result = tempResult.slice((data.page - 1) * data.size, data.page * data.size)
  return { result, count: tempResult.length }
}

export async function putExperience(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  await updateBaseInfoLastModified(fastify)
  return await fastify.prisma.experience.update({
    where: { id },
    data: {
      ...data,
      ...(data?.images && {
        images: {
          deleteMany: {},
          create: data.images.map((item: any) => {
            delete item.uid
            delete item.experienceId
            delete item.id
            return removeObjNullUndefined(item)
          })
        }
      })
    },
    include: {
      images: true
    }
  })
}

export async function deleteExperience(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  await updateBaseInfoLastModified(fastify)
  return await fastify.prisma.experience.delete({
    where: { id }
  })
}
