import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from 'src/utils'
import { validateBoth, validateRoot, validateUser } from 'src/auth'
import {
  deleteBlog,
  getBlog,
  getBlogList,
  getBlogType,
  postBlog,
  putBlog
} from './blogFn'
import { Blog, Image } from 'src/types/model'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.post('/blog', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const data = req.body as CreateBlog
    const result = await postBlog(fastify, data)
    return createRequestReturn(200, result as Blog, '')
  })
  fastify.get('/blog/:id', async (req: FastifyRequest, res: FastifyReply) => {
    const id = (req.params as { id: string }).id
    const increase = (req.query as { increase: 'true' | 'false' }).increase === 'true'
    const result = await getBlog(fastify, id, increase)
    return createRequestReturn(200, result, '')
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    const query = req.query as {
      size: string
      page: string
      sort?: 'asc' | 'desc'
      type?: string
      title?: string
      content?: string
      createdTimeFrom?: string
      createdTimeTo?: string
      lastModifiedTimeFrom?: string
      lastModifiedTimeTo?: string
    }
    const data = {
      ...query,
      size: parseInt(query.size, 10),
      page: parseInt(query.page, 10)
    }
    const result = await getBlogList(fastify, data)
    return createRequestReturn(200, result as Blog[], '')
  })
  fastify.delete(
    '/blog/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      await validateRoot(fastify, req, res)
      const id = (req.params as { id: string }).id
      const result = await deleteBlog(fastify, id)
      return createRequestReturn(200, result as Blog, '')
    }
  )
  fastify.put('/blog/:id', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const id = (req.params as { id: string }).id
    const data = req.body as CreateBlog
    const result = await putBlog(fastify, data, id)
    return createRequestReturn(200, result as Blog, '')
  })
  fastify.get('/blogType', async (req: FastifyRequest, res: FastifyReply) => {
    const result = await getBlogType(fastify)
    return createRequestReturn(200, result, '')
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
