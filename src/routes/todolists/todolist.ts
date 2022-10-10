import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from '../../utils'
import {
  createTodolist,
  deleteTodolist,
  getTodolistAll,
  putTodolist
} from './todolistFn'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/todolist', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data = req.body
      const result = await createTodolist(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data: any = req.query
      data.page = parseInt(data.page, 10)
      data.size = parseInt(data.size, 10)
      const result = await getTodolistAll(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.put(
    '/todolist/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const id = (req.params as { id: string }).id
        const data = req.body
        const result = await putTodolist(fastify, data, id)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.delete(
    '/todolist/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const id = (req.params as { id: string }).id
        const result = await deleteTodolist(fastify, id)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}
