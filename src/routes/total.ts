import info from './base/info.js'
import comments from './base/comments.js'

export default async function (
  fastify: any,
  options: any,
  done: any
): Promise<any> {
  await fastify.register(info)
  await fastify.register(comments)
  done()
}
