import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../../utils'
import { deleteBlog, getBlog, getBlogList, getBlogType, postBlog, putBlog } from './blogFn'
import { Blog, Image } from '../../../types/model'
import dayjs from 'dayjs'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/blog', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.rootId)
      const data = req.body as CreateBlog
      const result = await postBlog(fastify, data)
      return createRequestReturn(200, result as Blog, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/blog/:id', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const id = (req.params as { id: string }).id
      const result = await getBlog(fastify, id, true)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    console.log(req.query);
    
    // try {
      const query = req.query as {
        size: string
        page: string
        type?: string
        'time[]'?: [string, string]
      }
      const data = {
        ...query,
        size: parseInt(query.size, 10),
        page: parseInt(query.page, 10),
      }
      const result = await getBlogList(fastify, data)
      return createRequestReturn(200, result as Blog[], '')
    // } catch (e) {
    //   return createRequestReturn(500, null, (e as Error).message)
    // }
  })
  fastify.delete(
    '/blog/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.rootId)
        const id = (req.params as { id: string }).id
        const result = await deleteBlog(fastify, id)
        return createRequestReturn(200, result as Blog, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.put('/blog/:id', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.rootId)
      const id = (req.params as { id: string }).id
      const data = req.body as CreateBlog
      const result = await putBlog(fastify, data, id)
      return createRequestReturn(200, result as Blog, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/blogType', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const result = await getBlogType(fastify)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}

export interface CreateBlog {
  images: Image[]
  title: string
  content: string
  type: string
  post?: Image
}
