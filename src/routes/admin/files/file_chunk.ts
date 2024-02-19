import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../../utils'
import { mergeFileChunk, uploadFileChunk, md5Check } from './file_chunkFn'
import { deleteTempFilesByMd5 } from './utils'
import {
  FilesMergeRequest,
  FilesMergeReturn,
  Md5CheckRequest,
  Md5CheckReturn
} from './file_chunk.d'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/md5Check', async (req: FastifyRequest, res: FastifyReply) => {
    const { md5 } = req.query as { md5: string }
    try {
      await validateRoot(fastify, req.session.rootId)
      const data = req.body as Md5CheckRequest
      const result: Md5CheckReturn = await md5Check(md5, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.post('/fileChunk', async (req: FastifyRequest, res: FastifyReply) => {
    const { md5 } = req.query as { md5: string }
    try {
      await validateRoot(fastify, req.session.rootId)
      await uploadFileChunk(md5, req)
      return createRequestReturn(200, null, '')
    } catch (e) {
      deleteTempFilesByMd5(fastify, md5)
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.post('/fileMerge', async (req: FastifyRequest, res: FastifyReply) => {
    const { md5 } = req.query as { md5: string }
    try {
      await validateRoot(fastify, req.session.rootId)
      const data = req.body as FilesMergeRequest
      const result: FilesMergeReturn = await mergeFileChunk(fastify, md5, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    } finally {
      deleteTempFilesByMd5(fastify, md5)
    }
  })
  done()
}
