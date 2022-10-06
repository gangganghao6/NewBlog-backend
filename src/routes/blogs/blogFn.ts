import { FastifyInstance } from 'fastify'
import { v4 } from 'uuid'

export async function postBlog(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const mission = []
  const blogId = v4()
  if ('post' in data && data.post !== null) {
    mission.push(
      fastify.prisma.image.create({
        data: { ...data.post, blogpost_id: blogId }
      })
    )
  }
  if ('images' in data && data.images !== null && data.images.length > 0) {
    for (const image of data.images) {
      mission.push(
        fastify.prisma.image.create({
          data: { ...image, blogimages_id: blogId }
        })
      )
    }
  }
  mission.push(
    fastify.prisma.blog.create({
      data: {
        id: blogId,
        title: data.title,
        content: data.content,
        type: data.type
      }
    })
  )
  await fastify.prisma.$transaction(mission)
  return await getBlog(fastify, blogId)
}

export async function getBlogList(
  fastify: FastifyInstance,
  data: any
): Promise<any[]> {
  let tempResult
  if (!('type' in data)) {
    tempResult = await fastify.prisma.blog.findMany({
      take: data.size,
      skip: (data.page - 1) * data.size,
      select: {
        id: true
      },
      orderBy: {
        created_time: data.sort
      }
    })
  } else {
    tempResult = await fastify.prisma.blog.findMany({
      where: {
        type: {
          equals: data.type
        }
      },
      take: data.size,
      skip: (data.page - 1) * data.size,
      select: {
        id: true
      },
      orderBy: {
        created_time: data.sort
      }
    })
  }
  const result = []
  for (const obj of tempResult) {
    result.push(await getBlog(fastify, obj.id))
  }
  return result
}

export async function getBlog(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const blog = await fastify.prisma.blog.findFirstOrThrow({
    where: { id }
  })
  const post = await fastify.prisma.image.findFirst({
    where: { blogpost_id: id }
  })
  const images = await fastify.prisma.image.findMany({
    where: { blogimages_id: id }
  })
  return {
    ...blog,
    post,
    images
  }
}

export async function deleteBlog(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const mission = []
  mission.push(
    fastify.prisma.image.deleteMany({
      where: { blogpost_id: id }
    })
  )
  mission.push(
    fastify.prisma.image.deleteMany({ where: { blogimages_id: id } })
  )
  mission.push(
    fastify.prisma.comment.deleteMany({
      where: { blog_id: id }
    })
  )
  mission.push(
    fastify.prisma.blog.delete({
      where: { id }
    })
  )
  // pay不删除
  return await fastify.prisma.$transaction(mission)
}

export async function putBlog(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  if ('post' in data) {
    const mission = []
    mission.push(
      fastify.prisma.image.deleteMany({
        where: { blogpost_id: id }
      })
    )
    mission.push(
      fastify.prisma.image.create({
        data: { ...data.post, blogpost_id: id }
      })
    )
    await fastify.prisma.$transaction(mission)
  }
  if ('images' in data) {
    const mission = []
    mission.push(
      fastify.prisma.image.deleteMany({
        where: { blogimages_id: id }
      })
    )
    for (const image of data.images) {
      mission.push(
        fastify.prisma.image.create({
          data: { ...image, blogimages_id: id }
        })
      )
    }
    await fastify.prisma.$transaction(mission)
  }
  let temp = {}
  if ('title' in data) {
    temp = { ...temp, title: data.title }
  }
  if ('content' in data) {
    temp = { ...temp, content: data.content }
  }
  if ('type' in data) {
    temp = { ...temp, type: data.type }
  }
  await fastify.prisma.blog.update({
    where: { id },
    data: { ...temp, last_modified_time: new Date() }
  })
  return await getBlog(fastify, id)
}
