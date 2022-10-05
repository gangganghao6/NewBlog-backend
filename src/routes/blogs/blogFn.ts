import { FastifyInstance } from 'fastify'

export async function postBlog(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const result = await fastify.prisma.blog.create({
    data: {
      title: data.title,
      content: data.content,
      post: {
        create: data.image
      },
      type: data.type,
      images: {
        create: data.images
      }
    }
  })
  return result
}

export async function getBlogList(
  fastify: FastifyInstance,
  data: any
): Promise<any[]> {
  console.log(data)
  if (data.type === null) {
    return await fastify.prisma.blog.findMany({
      take: data.size,
      skip: (data.page - 1) * data.size,
      include: {
        post: true,
        images: true,
        comments: true
      }
    })
  } else {
    return await fastify.prisma.blog.findMany({
      where: {
        type: {
          equals: data.type
        }
      },
      take: data.size,
      skip: (data.page - 1) * data.size
    })
  }
}
