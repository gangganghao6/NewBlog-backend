import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from 'src/utils'
import { deleteProject, getProject, getProjectsList, postProject, putProject } from './projectFn'
import { Image, Project } from 'src/types/model'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/project', async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as CreateProject
    const result = await postProject(fastify, data)
    return createRequestReturn(200, result as Project, '')
  })
  fastify.put(
    '/project/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      const data = req.body as CreateProject
      const id = (req.params as { id: string }).id
      const result = await putProject(fastify, data, id)
      return createRequestReturn(200, result as Project, '')
    }
  )
  fastify.delete(
    '/project/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      const id = (req.params as { id: string }).id
      const result = await deleteProject(fastify, id)
      return createRequestReturn(200, result as never, '')
    }
  )
  fastify.get('/project/list', async (req: FastifyRequest, res: FastifyReply) => {
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
    const result = await getProjectsList(fastify, data)
    return createRequestReturn(200, result as ProjectReturn[], '')
  })
  fastify.get('/project/:id', async (req: FastifyRequest, res: FastifyReply) => {
    const id = (req.params as { id: string }).id
    const result = await getProject(fastify, id)
    return createRequestReturn(200, result as ProjectReturn[], '')
  })
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
  images?: Image
}
export interface ProjectReturn {
  name: string
  duty: string
  description: string
  timeStart: Date
  githubUrl?: string
  demoUrl?: string
  timeEnd?: string
  images?: Image
}
