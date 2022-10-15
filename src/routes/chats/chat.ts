import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  deleteChat,
  deleteUserChatAll,
  getChatAll,
  sendMessage
} from './chatFn'
import { createRequestReturn } from '../../utils'
import IP2Region from 'ip2region'

// eslint-disable-next-line new-cap,@typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line new-cap
const query = new IP2Region.default({
  disableIpv6: true
})
const clients: any[] = []

export default function (
  fastify: FastifyInstance,
  config: never,
  done: any
): void {
  fastify.get('/', { websocket: true }, (connection, req) => {
    const userId = (req.query as { user_id: string }).user_id
    let timer = setTimeout(() => {
      clients.splice(
        clients.findIndex((obj) => obj.user_id === userId),
        1
      )
    }, 70 * 1000)
    clients.push({
      userId,
      connection
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    connection.socket.on('message', async (buf: Buffer) => {
      try {
        const data: any = JSON.parse(buf.toString())
        if (data.type === 'heart_beat') {
          clearTimeout(timer)
          timer = setTimeout(() => {
            clients.splice(
              clients.findIndex((obj) => obj.userId === userId),
              1
            )
          }, 70 * 1000)
        } else if (data.type === 'send_message') {
          const location: {
            country: string
            province: string
            city: string
            isp: string
          } = query.search(req.ip)
          data.location = `${location.country}/${location.province}/${location.city}/${location.isp}`
          clients.forEach((obj) => {
            obj.connection.socket.send(JSON.stringify(data))
          })
          data.ip = req.ip
          const result = await sendMessage(fastify, data)
          connection.socket.send(
            JSON.stringify(createRequestReturn(200, result, ''))
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
      const result = await getChatAll(fastify, data)
      return createRequestReturn(200, result, '')
    } catch (e) {
      return createRequestReturn(500, null, (e as Error).message)
    }
  })
  fastify.delete(
    '/chat/:id',
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const id = (req.params as { id: string }).id
        const result = await deleteChat(fastify, id)
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
        const id = (req.params as { id: string }).id
        const result = await deleteUserChatAll(fastify, id)
        return createRequestReturn(200, result, '')
      } catch (e) {
        return createRequestReturn(500, null, (e as Error).message)
      }
    }
  )
  done()
}
