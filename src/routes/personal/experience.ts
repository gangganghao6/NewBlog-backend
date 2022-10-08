import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from '../../utils'
import { deleteExperience, postExperience, putExperience } from './experienceFn'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post(
    '/experience',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const data = req.body
        const result = await postExperience(fastify, data)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.put(
    '/experience/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const data = req.body
        const id = (req.params as { id: string }).id
        const result = await putExperience(fastify, data, id)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.delete(
    '/experience/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const id = (req.params as { id: string }).id
        const result = await deleteExperience(fastify, id)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}
