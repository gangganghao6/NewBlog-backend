import { BaseRoute, FilesRoute } from './routes/total'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

async function registRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(BaseRoute, { prefix: '/api/base' })
  await fastify.register(FilesRoute, { prefix: '/api/files' })
}

async function registStatic(fastify: FastifyInstance): Promise<void> {
  await fastify.get(
    '/frontend',
    async (req: FastifyRequest, res: FastifyReply) => {
      await res.sendFile('index.html')
    }
  )
}

export { registRoutes, registStatic }
