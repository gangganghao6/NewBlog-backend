import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../utils'
import { deleteProject, postProject, putProject } from './projectFn'
import { Image, Project } from '../../types/model'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/project', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.root_id)
      const data = req.body as CreateProject
      const result = await postProject(fastify, data)
      return createRequestReturn(200, result as Project, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.put(
    '/project/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.root_id)
        const data = req.body as CreateProject
        const id = (req.params as { id: string }).id
        const result = await putProject(fastify, data, id)
        return createRequestReturn(200, result as Project, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.delete(
    '/project/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.root_id)
        const id = (req.params as { id: string }).id
        const result = await deleteProject(fastify, id)
        return createRequestReturn(200, result as never, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}

export interface CreateProject {
  name: string
  duty: string
  description: string
  time_start: Date
  github_url?: string
  demo_url?: string
  time_end?: string
  image?: Image
}
