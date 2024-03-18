import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  deleteUserVisit,
  getUserVisit,
  getUserVisitAll,
  getUserVisitAnalysis,
  postUserVisitLog
} from './logFn'
import { createRequestReturn } from 'src/utils'
import { validateRoot } from 'src/auth'
import { UserVisit } from 'src/types/model'

export default function (
  fastify: FastifyInstance,
  config = {},
  done: any
): void {
  fastify.post('/url', async (req: FastifyRequest, res: FastifyReply) => {
    const data: any = JSON.parse(req.body as string) as UserVisitCreate
    const userId = req.session.userId
    const ip = req.ip
    const userAgent = req.headers['user-agent']

    await postUserVisitLog(fastify, {
      data,
      ip,
      userId,
      userAgent
    })

    return createRequestReturn(200, '', '')
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const data: any = req.query
    data.size = parseInt(data.size, 10)
    data.page = parseInt(data.page, 10)
    const result = await getUserVisitAll(fastify, data)
    return createRequestReturn(200, result as UserVisitReturn, '')
  })
  fastify.post('/url/:id', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const id = (req.params as { id: string }).id
    const result = await getUserVisitAll(fastify, id)
    return createRequestReturn(200, result as UserVisitReturn, '')
  })
  fastify.get('/url/:id', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const id = (req.params as { id: string }).id
    const result = await getUserVisit(fastify, id)
    return createRequestReturn(200, result as UserVisitReturn, '')
  })
  fastify.delete('/url/:id', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const id = (req.params as { id: string }).id
    const result = await deleteUserVisit(fastify, id)
    return createRequestReturn(200, result as UserVisitReturn, '')
  })
  fastify.get('/analysis', async (req: FastifyRequest, res: FastifyReply) => {
    await validateRoot(fastify, req, res)
    const result = await getUserVisitAnalysis(fastify)
    return createRequestReturn(200, result as UserVisitAnalysis, '')

  })
  done()
}

export interface UserVisitCreate {
  [index: number]: [{ url: string }]
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
