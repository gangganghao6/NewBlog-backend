import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from 'src/utils'
import {
  deleteShareFile,
  getShareFile,
  getShareFileList,
  increaseShareFileDownload,
  putShareFile,
  uploadShareFile
} from './share_fileFn'
import { Image, ShareFile, Video } from 'src/types/model'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/file', async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as CreateShareFile
    const result = await uploadShareFile(fastify, data)
    return createRequestReturn(200, result as ShareFileReturn, '')
  })
  fastify.delete(
    '/file/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      const id = (req.params as { id: string }).id
      const result = await deleteShareFile(fastify, id)
      return createRequestReturn(200, result, '')
    }
  )
  fastify.put('/file/:id', async (req: FastifyRequest, res: FastifyReply) => {
    const id = (req.params as { id: string }).id
    const data = req.body
    // const type = (req.body as { type: string }).type
    const result = await putShareFile(fastify, { id, data })
    return createRequestReturn(200, result as ShareFile, '')
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
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
    
    return createRequestReturn(200, result as ShareFileReturn[], '')
  })
  fastify.get(
    '/download/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      const id = (req.params as { id: string }).id
      const result = await increaseShareFileDownload(fastify, id)
      return createRequestReturn(200, result as ShareFile, '')
    }
  )
  fastify.get(
    '/file/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      const id = (req.params as { id: string }).id
      const result = await getShareFile(fastify, id)
      return createRequestReturn(200, result as ShareFile, '')
    }
  )
  done()
}

export interface CreateShareFile {
  type: string
  // media_class: 'videos' | 'images' | 'files'
  videos?: Video
  images?: Image
  files?: File
}

export interface ShareFileReturn {
  shareFile: ShareFile
  videos?: Video
  images?: Image
  files?: File
}
