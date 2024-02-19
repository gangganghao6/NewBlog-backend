import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  deleteChat,
  deleteUserChatAll,
  getChatAll,
  sendMessage
} from './chatFn'
import { createRequestReturn, validateRoot, validateUser } from '../../../utils'
import IP2Region from 'ip2region'
import { Chat, File, Image, Video } from '../../../types/model'

// eslint-disable-next-line new-cap,@typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line new-cap
const ipQuery = new IP2Region.default({
  disableIpv6: true
})
// const clients: Array<{ userId: string; connection: any }> = []

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.get('/', { websocket: true }, async (connection, req) => {
    await validateUser(fastify, req.session.userId)
    const userId = (req.query as { userId: string }).userId
    connection.socket.on('message', async (buf: Buffer) => {
      const data: any = JSON.parse(buf.toString()) as CreateChat

      const location: {
        country: string
        province: string
        city: string
        isp: string
      } = ipQuery.search(req.ip)
      data.location = `${location.country}/${location.province}/${location.city}/${location.isp}`
      data.userId = userId
      data.ip = req.ip

      const result = (await sendMessage(fastify, data)) as Chat
      fastify.websocketServer.clients.forEach((obj) => {
        obj.send(JSON.stringify(createRequestReturn(200, result, '')))
      })
    })
  })
  fastify.get('/list', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data: any = req.query
      data.size = parseInt(data.size, 10)
      data.page = parseInt(data.page, 10)
      const result = (await getChatAll(fastify, data)) as Chat[]
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.delete(
    '/chat/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.rootId)
        const id = (req.params as { id: string }).id
        const result = (await deleteChat(fastify, id)) as { count: number }
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  fastify.delete(
    '/user/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await validateRoot(fastify, req.session.rootId)
        const id = (req.params as { id: string }).id
        const result = (await deleteUserChatAll(fastify, id)) as {
          count: number
        }
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}

export interface CreateChat {
  // type: 'sendMessage' | 'heartBeat'
  // media_class: 'text' | 'image' | 'video' | 'file'
  content?: string
  userId: string
  image?: Image
  video?: Video
  file?: File
}
