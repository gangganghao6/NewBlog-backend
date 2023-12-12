import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyError
} from 'fastify'
import { getProjectPath, validateRoot, validateUser } from 'src/utils'
import fs from 'fs'
import path from 'path'
const authLists = JSON.parse(
  fs.readFileSync(
    path.join(getProjectPath(), 'src/interceptor/authLists.json'),
    'utf-8'
  )
)
async function registeInterceptor(fastify: FastifyInstance): Promise<void> {
  await fastify.addHook(
    'onRequest',
    async (req: FastifyRequest, res: FastifyReply) => {
      const url = req.url.replaceAll('/api', '')
      if (authLists.user.includes(url) === true) {
        await validateUser(fastify, req.session.userId)
      } else if (authLists.root.includes(url) === true) {
        await validateRoot(fastify, req.session.rootId)
      }
      //
    }
  )
  await fastify.addHook(
    'onError',
    async (req: FastifyRequest, res: FastifyReply, err: FastifyError) => {
      console.log(111, err)

      // await res.send(5555)
      // return createRequestReturn(500, null, err.message)
    }
  )
  await fastify.addHook(
    'onSend',
    async (req: FastifyRequest, res: FastifyReply, payload: string) => {
      return payload
    }
  )
}

export default registeInterceptor
