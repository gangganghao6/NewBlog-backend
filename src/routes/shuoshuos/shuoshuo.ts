import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../utils'
import {
  deleteShuoshuo,
  getShuoshuo,
  getShuoshuoList,
  postShuoshuo,
  putShuoshuo
} from './shuoshuoFn'
import { Image, Shuoshuo, Video } from '../../types/model'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/shuoshuo', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.root_id)
      const data = req.body as CreateShuoshuo
      const result = await postShuoshuo(fastify, data)
      return createRequestReturn(200, result as Shuoshuo, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data: any = req.query
      data.size = parseInt(data.size, 10)
      data.page = parseInt(data.page, 10)
      const result = await getShuoshuoList(fastify, data)
      return createRequestReturn(200, result as Shuoshuo[], '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get(
    '/shuoshuo/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const id = (req.params as { id: string }).id
        const result = await getShuoshuo(fastify, id, true)
        return createRequestReturn(200, result as Shuoshuo, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.put(
    '/shuoshuo/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.root_id)
        const id = (req.params as { id: string }).id
        const data = req.body
        const result = await putShuoshuo(fastify, data, id)
        return createRequestReturn(200, result as Shuoshuo, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.delete(
    '/shuoshuo/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.root_id)
        const id = (req.params as { id: string }).id
        const result = await deleteShuoshuo(fastify, id)
        return createRequestReturn(200, result as never, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}

export interface CreateShuoshuo {
  media_class: 'video' | 'images' | 'text'
  content?: '?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????'
  images?: Image[]
  video?: Video
}
