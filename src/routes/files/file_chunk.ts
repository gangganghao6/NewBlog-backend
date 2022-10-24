import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../utils'
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
        await validateRoot(fastify, req.session.root_id)
        await uploadFileChunk(req)
        return createRequestReturn(200, null, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.post(
    '/file_merge',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.root_id)
        const data = req.body as Files_merge
        const result = await mergeFileChunk(data)
        return createRequestReturn(200, result as Files_return, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}

export interface Files_chunk {
  uuid: string
  total_slices: number
  current_slices: number
  file_type: string // 'txt'/'jpg'...
  media_class: 'images' | 'videos' | 'files' | ''
  file_slices: Buffer
}

export interface Files_merge {
  uuid: string
  media_class: 'images' | 'videos' | 'files'
  file_type: string // 'txt'/'jpg'...
}

export interface Files_return {
  name: string
  url: string
  size: number
  media_class: 'images' | 'videos' | 'files'
  file_type: string // 'txt'/'jpg'...
  duration?: number
}
