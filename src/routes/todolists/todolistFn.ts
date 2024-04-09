import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { updateBaseInfoLastModified } from 'src/routes/base/infoFn'

export async function createTodolist(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  await updateBaseInfoLastModified(fastify)
  return await fastify.prisma.todolist.create({
    data: {
      title: data.title
    }
  })
}

export async function getTodolistList(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const countObj = {
    where: {
      id: {
        contains: data.id
      },
      title: {
        contains: data.title
      },
      ...(data.isDone && { isDone: data.isDone === 'false' ? false : true }),
      isDoneTime: data.isDoneTime && {
        gte: dayjs(data.isDoneTime).add(8, 'hour').toDate(),
        lte: dayjs(data.isDoneTime).add(32, 'hour').toDate(),
      },
      createdTime: data.createdTimeFrom && {
        gte: dayjs(data.createdTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.createdTimeTo).add(32, 'hour').toDate(),
      },
    }
  }
  const searchObj = {
    ...countObj,
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      createdTime: data.sort
    }
  }
  const count = await fastify.prisma.todolist.count(countObj)
  const result = await fastify.prisma.todolist.findMany(searchObj)
  return { result, count }
}
export async function getTodolist(fastify: FastifyInstance, id: string): Promise<any> {
  return await fastify.prisma.todolist.findUnique({
    where: { id }
  })
}
export async function putTodolist(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  await updateBaseInfoLastModified(fastify)
  return await fastify.prisma.todolist.update({
    where: { id },
    data
  })
}

export async function deleteTodolist(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  await updateBaseInfoLastModified(fastify)
  return await fastify.prisma.todolist.delete({
    where: { id }
  })
}
