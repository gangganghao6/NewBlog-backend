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
    try {
      const data = req.body
      const result = await uploadShareFile(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.delete(
    '/file/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const id = (req.params as { id: string }).id
        await deleteShareFile(fastify, id)
        return createRequestReturn(200, true, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.put('/file/:id', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const id = (req.params as { id: string }).id
      const type = (req.body as { type: string }).type
      const result = await putShareFile(fastify, { id, type })
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const query = req.query as {
        size: string
        page: string
        type?: string
        sort?: string
      }
      const data = {
        ...query,
        size: parseInt(query.size, 10),
        page: parseInt(query.page, 10)
      }
      const result = await getShareFileList(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}
