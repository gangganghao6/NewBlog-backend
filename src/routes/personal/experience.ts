import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../utils'
import { deleteExperience, postExperience, putExperience } from './experienceFn'
import { Experience, Image } from '../../types/model'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post(
    '/experience',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.root_id)
        const data = req.body as CreateExperience
        const result = await postExperience(fastify, data)
        return createRequestReturn(200, result as Experience, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.put(
    '/experience/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.root_id)
        const data = req.body
        const id = (req.params as { id: string }).id
        const result = await putExperience(fastify, data, id)
        return createRequestReturn(200, result as Experience, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.delete(
    '/experience/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.root_id)
        const id = (req.params as { id: string }).id
        const result = await deleteExperience(fastify, id)
        return createRequestReturn(200, result as never, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}

export interface CreateExperience {
  company: string
  duty: string
  description: string
  time_start: Date
  time_end?: Date
  image?: Image
}
