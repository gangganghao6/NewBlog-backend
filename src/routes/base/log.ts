import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  getUserVisitAll,
  getUserVisitAnalysis,
  postUserVisitLog
} from './logFn'
import { createRequestReturn, validateRoot } from '../../utils'
import { UserVisit } from '../../types/model'

export default function (
  fastify: FastifyInstance,
  config = {},
  done: any
): void {
  fastify.post('/url', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data: any = req.body as UserVisitCreate
      const ip = req.ip
      const userAgent = req.headers['user-agent']
      await postUserVisitLog(fastify, {
        data,
        ip,
        userAgent
      })
      return createRequestReturn(200, '', '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.rootId)
      const data: any = req.query
      data.size = parseInt(data.size, 10)
      data.page = parseInt(data.page, 10)
      const result = await getUserVisitAll(fastify, data)
      return createRequestReturn(200, result as UserVisitReturn, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.get('/analysis', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await validateRoot(fastify, req.session.rootId)
      const result = await getUserVisitAnalysis(fastify)
      return createRequestReturn(200, result as UserVisitAnalysis, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  done()
}

export interface UserVisitCreate {
  [index: number]: [{ user_id?: string; url: string }]
}

export interface UserVisitReturn {
  result: { [index: number]: [UserVisit] }
  count: number
}

export interface UserVisitAnalysis {
  browserNames: any
  engineNames: any
  osNames: any
  deviceTypes: any
  cpuArchitectures: any
  countrys: any
  provinces: any
  citys: any
  userIds: any
  visitTimes: any
  isps: any
  ips: any
  urls: any
}
