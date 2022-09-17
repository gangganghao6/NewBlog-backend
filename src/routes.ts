import base from './routes/total.js'
import { FastifyReply, FastifyRequest } from 'fastify'

async function registRoutes(fastify: any): Promise<void> {
  await fastify.register(base, { prefix: '/api/base' })
}

async function registStatic(fastify: any): Promise<void> {
  await fastify.get(
    '/frontend',
    async (req: FastifyRequest, res: FastifyReply) => {
      await res.sendFile('index.html')
    }
  )
}

export { registRoutes, registStatic }
