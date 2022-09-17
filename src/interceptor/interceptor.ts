import { FastifyReply, FastifyRequest } from 'fastify'

async function beforeSend(fastify: any): Promise<void> {
  await fastify.addHook(
    'onSend',
    async (req: FastifyRequest, res: FastifyReply, payload: string) => {
      return payload
    }
  )
}

async function beforeRequest(fastify: any): Promise<void> {
  await fastify.addHook(
    'onRequest',
    async (req: FastifyRequest, res: FastifyReply) => {
      console.log(req.session.user)
    }
  )
}

export { beforeSend, beforeRequest }
