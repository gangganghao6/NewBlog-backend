import { FastifyInstance } from 'fastify'

export async function createTodolist(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.todolist.create({
    data: {
      title: data.title
    }
  })
}

export async function getTodolistAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const count = await fastify.prisma.todolist.count()
  const result = await fastify.prisma.todolist.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      created_time: data.sort
    }
  })
  return { result, count }
}

export async function putTodolist(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  return await fastify.prisma.todolist.update({
    where: { id },
    data
  })
}

export async function deleteTodolist(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.todolist.delete({
    where: { id }
  })
}
