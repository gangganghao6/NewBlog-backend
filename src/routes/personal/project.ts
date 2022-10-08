import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from '../../utils'
import { deleteProject, postProject, putProject } from './projectFn'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/project', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data = req.body
      const result = await postProject(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.put(
    '/project/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const data = req.body
        const id = (req.params as { id: string }).id
        const result = await putProject(fastify, data, id)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.delete(
    '/project/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const id = (req.params as { id: string }).id
        const result = await deleteProject(fastify, id)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}
