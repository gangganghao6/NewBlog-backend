import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { getGithubAll, getGithubById, updateGithub } from './githubFn'
import { createRequestReturn } from 'src/utils'
import { Github } from 'src/types/model'
import { validateRoot } from 'src/auth'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const data: any = req.query
    data.page = parseInt(data.page, 10)
    data.size = parseInt(data.size, 10)
    const result = await getGithubAll(fastify, data)
    return createRequestReturn(200, result as Github[], '')
  })
  fastify.get('/github/:id', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const id = (req.params as { id: string }).id
    const result = await getGithubById(fastify, id, true)
    return createRequestReturn(200, result as Github, '')
  })
  if (process.env.NODE_ENV.trim() === 'prod') {
    void updateGithub(fastify)
    setInterval(() => {
      void updateGithub(fastify)
    }, 1000 * 60 * 10)
  }
  done()
}
