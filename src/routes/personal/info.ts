import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn } from 'src/utils'
import { createPersonalComment, deletePersonalComment, getPersonalInfoAll, putPersonalInfo } from './infoFn'
import { Personal } from 'src/types/model'
import { validateBoth, validateUser } from 'src/auth'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.get('/info', async (req: FastifyRequest, res: FastifyReply) => {
    const increase = (req.query as { increase: 'true' | 'false' }).increase === 'true'
    const exist = await fastify.prisma.personal.findFirst()
    if (exist === null) {
      throw new Error('个人页面未初始化')
    }
    const result = await getPersonalInfoAll(fastify, increase)
    return createRequestReturn(200, result as Personal, '')
  })
  fastify.put('/info', async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as CreatePersonal
    const result = await putPersonalInfo(fastify, data)
    return createRequestReturn(200, result as Personal, '')
  })
  fastify.post('/personalcomment', async (req: FastifyRequest, res: FastifyReply) => {
    await validateUser(fastify, req, res)
    const data = req.body as any
    const userId = req.session.userId
    const result = await createPersonalComment(fastify, { userId, ...data })
    return createRequestReturn(200, result, '')
  })
  fastify.delete('/personalcomment', async (req: FastifyRequest, res: FastifyReply) => {
    await validateBoth(fastify, req, res)
    const data = req.body as any
    const result = await deletePersonalComment(fastify, data)
    return createRequestReturn(200, result, '')
  })
  done()
}

export interface CreatePersonal {
  name: string
  sex: string
  birthday: Date
  wechat: string
  qq: string
  githubName: string
  githubUrl: string
  university: string
  home: string
  universityEndTime?: Date
  content: string
}
