import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../utils'
import { mergeFileChunk, uploadFileChunk, md5Check } from './file_chunkFn'
import { PathLike } from 'fs'
import { deleteTempFilesByMd5 } from './utils'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/md5Check', async (req: FastifyRequest, res: FastifyReply) => {
    const { md5 } = req.query as { md5: string }
    try {
      await validateRoot(fastify, req.session.rootId)
      const data = req.body as Md5Check
      const result = await md5Check(md5, data)
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
      deleteTempFilesByMd5(md5)
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.post('/fileMerge', async (req: FastifyRequest, res: FastifyReply) => {
    const { md5 } = req.query as { md5: string }
    try {
      await validateRoot(fastify, req.session.rootId)
      const data = req.body as FilesMerge
      const result = await mergeFileChunk(fastify, md5, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    } finally {
      deleteTempFilesByMd5(md5)
    }
  })
  done()
}
export interface Md5Check {
  md5: string
  originalName: string
  fileType: string
}
export interface FilesChunk {
  md5: string
  totalSlicesNum: number
  currentSlicesNum: number
  tempFilesPath: PathLike
}

export interface FilesMerge {
  md5: string
  fileType: string // 'txt'/'jpg'...
  originalName: string
}

export interface FilesReturn {
  name: string
  url: string
  size: number
  originalName: string
  mediaClass: 'images' | 'videos' | 'files'
  fileType: string // 'txt'/'jpg'...
  duration?: number
}
