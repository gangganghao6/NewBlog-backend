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
      await validateRoot(fastify, req.session.rootId)
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
        await validateRoot(fastify, req.session.rootId)
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
        await validateRoot(fastify, req.session.rootId)
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
  timeStart: Date
  githubUrl?: string
  demoUrl?: string
  timeEnd?: string
  image?: Image
}
