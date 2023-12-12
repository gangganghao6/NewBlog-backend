import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../utils'
import { mergeFileChunk, uploadFileChunk } from './file_chunkFn'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/fileChunk', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.rootId)
      await uploadFileChunk(req)
      return createRequestReturn(200, null, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.post('/fileMerge', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.rootId)
      const data = req.body as FilesMerge
      const result = await mergeFileChunk(data)
      return createRequestReturn(200, result as FilesReturn, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}

export interface Files_chunk {
  uuid: string
  totalSlicesNum: number
  currentSlicesNum: number
  // file_type: string // 'txt'/'jpg'...
  // media_class: 'images' | 'videos' | 'files'
  fileSlices: Buffer
}

export interface FilesMerge {
  uuid: string
  // mediaType: 'images' | 'videos' | 'files'
  fileType: string // 'txt'/'jpg'...
}

export interface FilesReturn {
  name: string
  url: string
  size: number
  mediaClass: 'images' | 'videos' | 'files'
  fileType: string // 'txt'/'jpg'...
  duration?: number
}
