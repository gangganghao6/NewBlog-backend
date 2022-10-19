import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

async function registeInterceptor(fastify: FastifyInstance): Promise<void> {
  await fastify.addHook(
    'onRequest',
    async (req: FastifyRequest, res: FastifyReply) => {
      //
    }
  )
  // await fastify.addHook(
  //   'onError',
  //   async (req: FastifyRequest, res: FastifyReply, err: FastifyError) => {
  // await res.send(5555)
  // return createRequestReturn(500, null, err.message)
  //   }
  // )
  await fastify.addHook(
    'onSend',
    async (req: FastifyRequest, res: FastifyReply, payload: string) => {
      return payload
    }
  )
}

export default registeInterceptor
