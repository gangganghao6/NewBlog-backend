import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from '../../utils'
import {
  deleteShareFile,
  getShareFileList,
  putShareFile,
  uploadShareFile
} from './share_fileFn'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/file', async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body
    try {
      const result = await uploadShareFile(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.delete(
    '/file/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      const id = (req.params as { id: string }).id
      try {
        await deleteShareFile(fastify, id)
        return createRequestReturn(200, true, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.put('/file/:id', async (req: FastifyRequest, res: FastifyReply) => {
    const id = (req.params as { id: string }).id
    const type = (req.body as { type: string }).type
    try {
      const result = await putShareFile(fastify, { id, type })
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    const query = req.query as {
      size: string
      page: string
      type?: string
    }
    const data = {
      size: parseInt(query.size, 10),
      page: parseInt(query.page, 10),
      type: query.type != null ? query.type : null
    }
    try {
      const result = await getShareFileList(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}
