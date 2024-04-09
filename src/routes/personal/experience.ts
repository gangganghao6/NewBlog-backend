import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from 'src/utils'
import { deleteExperience, getExperience, getExperiencesList, postExperience, putExperience } from './experienceFn'
import { Experience, Image } from 'src/types/model'
import { validateRoot } from 'src/auth'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post(
    '/experience',
    async (req: FastifyRequest, res: FastifyReply) => {
      await validateRoot(fastify, req, res)
      const data = req.body as CreateExperience
      const result = await postExperience(fastify, data)
      return createRequestReturn(200, result as Experience, '')
    }
  )
  fastify.put(
    '/experience/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      await validateRoot(fastify, req, res)
      const data = req.body
      const id = (req.params as { id: string }).id
      const result = await putExperience(fastify, data, id)
      return createRequestReturn(200, result as Experience, '')
    }
  )
  fastify.delete(
    '/experience/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      await validateRoot(fastify, req, res)
      const id = (req.params as { id: string }).id
      const result = await deleteExperience(fastify, id)
      return createRequestReturn(200, result as never, '')
    }
  )
  fastify.get('/experience/list', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const query = req.query as {
      size: string
      page: string
      type?: string
      sort?: string
    }
    const data = {
      ...query,
      size: parseInt(query.size, 10),
      page: parseInt(query.page, 10)
    }
    const result = await getExperiencesList(fastify, data)
    return createRequestReturn(200, result as ExperienceReturn[], '')
  })
  fastify.get('/experience/:id', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const id = (req.params as { id: string }).id
    const result = await getExperience(fastify, id)
    return createRequestReturn(200, result as ExperienceReturn[], '')
  })
  done()
}

export interface CreateExperience {
  company: string
  duty: string
  description: string
  timeStart: Date
  timeEnd?: Date
  images?: Image[]
}

export interface ExperienceReturn {
  company: string
  duty: string
  description: string
  timeStart: Date
  timeEnd?: Date
  images?: Image[]
}