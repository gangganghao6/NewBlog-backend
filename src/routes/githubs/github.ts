import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { getGithubAll, getGithubById, updateGithub } from './githubFn'
import { createRequestReturn } from 'src/utils'
import { Github } from 'src/types/model'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data: any = req.query
      data.page = parseInt(data.page, 10)
      data.size = parseInt(data.size, 10)
      const result = await getGithubAll(fastify, data)
      return createRequestReturn(200, result as Github[], '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/github/:id', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const id = (req.params as { id: string }).id
      const result = await getGithubById(fastify, id, true)
      return createRequestReturn(200, result as Github, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  if (process.env.NODE_ENV.trim() === 'prod') {
    void updateGithub(fastify)
    setInterval(() => {
      void updateGithub(fastify)
    }, 1000 * 60 * 10)
  }
  done()
}
