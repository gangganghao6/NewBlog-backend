import { FastifyReply, FastifyRequest } from 'fastify'

function beforeSend(fastify: any): void {
  fastify.addHook(
    'onSend',
    async (req: FastifyRequest, res: FastifyReply, payload: string) => {
      return JSON.stringify({
        data: JSON.parse(payload),
        status: res.statusCode,
        message: 'success'
      })
    }
  )
}

function beforeRequest(fastify: any): void {
  fastify.addHook(
    'onRequest',
    async (req: FastifyRequest, res: FastifyReply) => {
      console.log(req.cookies)
    }
  )
}

export { beforeSend, beforeRequest }
