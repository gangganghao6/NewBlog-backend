import base from './routes/total'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

async function registRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(base, { prefix: '/api/base' })
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
