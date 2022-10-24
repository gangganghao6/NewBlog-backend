import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createRequestReturn, validateRoot } from '../../utils'
import { getPersonalInfoAll, postPersonalInfo, putPersonalInfo } from './infoFn'
import { Personal } from '../../types/model'

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.get('/info', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const exist = await fastify.prisma.personal.findFirst()
      if (exist === null) {
        return createRequestReturn(500, null, '个人页面未初始化')
      }
      const result = await getPersonalInfoAll(fastify)
      return createRequestReturn(200, result as Personal, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.post('/info', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.root_id)
      const data = req.body as CreatePersonal
      const exist = await fastify.prisma.personal.findFirst()
      if (exist !== null) {
        return createRequestReturn(500, null, '个人页面已初始化')
      }
      const result = await postPersonalInfo(fastify, data)
      return createRequestReturn(200, result as Personal, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.put('/info', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.root_id)
      const data = req.body as CreatePersonal
      const exist = await fastify.prisma.personal.findFirst()
      if (exist === null) {
        return createRequestReturn(500, null, '个人页面未初始化')
      }
      const result = await putPersonalInfo(fastify, data)
      return createRequestReturn(200, result as Personal, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}

export interface CreatePersonal {
  name: string
  sex: string
  birthday: Date
  wechat: string
  qq: string
  github: string
  university: string
  home: string
  university_end_time?: Date
  readme: string
}
