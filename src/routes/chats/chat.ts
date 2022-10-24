import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  deleteChat,
  deleteUserChatAll,
  getChatAll,
  sendMessage
} from './chatFn'
import { createRequestReturn, validateRoot, validateUser } from '../../utils'
import IP2Region from 'ip2region'
import { Chat } from '../../types/model'

// eslint-disable-next-line new-cap,@typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line new-cap
const query = new IP2Region.default({
  disableIpv6: true
})
const clients: Array<{ userId: string; connection: any }> = []

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.get('/', { websocket: true }, async (connection, req) => {
    await validateUser(fastify, req.session.user_id)
    const userId = (req.query as { user_id: string }).user_id
    let timer = setTimeout(() => {
      clients.splice(
        clients.findIndex((obj) => obj.userId === userId),
        1
      )
    }, 60 * 1000)
    clients.push({
      userId,
      connection
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    connection.socket.on('message', async (buf: Buffer) => {
      try {
        const data: any = JSON.parse(buf.toString()) as CreateChat
        if (data.type === 'heart_beat') {
          clearTimeout(timer)
          timer = setTimeout(() => {
            clients.splice(
              clients.findIndex((obj) => obj.userId === userId),
              1
            )
          }, 60 * 1000)
        } else if (data.type === 'send_message') {
          const location: {
            country: string
            province: string
            city: string
            isp: string
          } = query.search(req.ip)
          data.location = `${location.country}/${location.province}/${location.city}/${location.isp}`
          clients.forEach((obj) => {
            obj.connection.socket.send(
              JSON.stringify(createRequestReturn(200, data, ''))
            )
          })
          data.ip = req.ip
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          const result = (await sendMessage(fastify, data)) as Chat
          connection.socket.send(
            JSON.stringify(
              createRequestReturn(
                200,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                { type: 'message_confirm', ...result },
                ''
              )
            )
          )
        }
      } catch (e) {
        connection.socket.send(
          JSON.stringify(createRequestReturn(500, null, (e as Error).message))
        )
      }
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
        await validateRoot(fastify, req.session.root_id)
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
        await validateRoot(fastify, req.session.root_id)
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
  type: 'send_message' | 'heart_beat'
  media_class: 'text' | 'image' | 'video' | 'file'
  content?: string
  user_id: string
}
