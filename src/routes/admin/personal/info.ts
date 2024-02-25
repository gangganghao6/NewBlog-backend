import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../../utils'
import { getPersonalInfoAll, putPersonalInfo } from './infoFn'
import { Personal } from '../../../types/model'

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
