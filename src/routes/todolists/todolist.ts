import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from 'src/utils'
import {
  createTodolist,
  deleteTodolist,
  getTodolist,
  getTodolistList,
  putTodolist
} from './todolistFn'
import { Todolist } from 'src/types/model'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/todolist', async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as { title: string }
    const result = await createTodolist(fastify, data)
    return createRequestReturn(200, result as Todolist, '')
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    const data: any = req.query
    data.page = parseInt(data.page, 10)
    data.size = parseInt(data.size, 10)
    const result = await getTodolistList(fastify, data)
    return createRequestReturn(200, result as Todolist[], '')
  })
  fastify.put(
    '/todolist/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      const id = (req.params as { id: string }).id
      const data = req.body as PutTodolist
      const result = await putTodolist(fastify, data, id)
      return createRequestReturn(200, result as Todolist, '')
    }
  )
  fastify.delete(
    '/todolist/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      const id = (req.params as { id: string }).id
      const result = await deleteTodolist(fastify, id)
      return createRequestReturn(200, result as never, '')
    }
  )
  fastify.get('/todolist/:id', async (req: FastifyRequest, res: FastifyReply) => {
    const id = (req.params as { id: string }).id
    const result = await getTodolist(fastify, id)
    return createRequestReturn(200, result as Todolist, '')
  })
  done()
}

export interface PutTodolist {
  title?: string
  isDone?: boolean
  isDoneTime?: Date
  createdTime?: Date
}
