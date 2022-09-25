import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from '../../utils'
import { mergeFileChunk, uploadFileChunk } from './file_chunkFn'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post(
    '/file_chunk',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await uploadFileChunk(req)
        return createRequestReturn(200, '', '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.post(
    '/file_merge',
    async (req: FastifyRequest, res: FastifyReply) => {
      const data = JSON.parse(req.body as string)
      const result = await mergeFileChunk(data)
      return createRequestReturn(200, result, '')
    }
  )
  done()
}
