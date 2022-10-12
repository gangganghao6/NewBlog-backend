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
  // 未解决断开连接移除
  fastify.get('/', { websocket: true }, (connection, req) => {
    const id = (req.query as { id: string }).id
    // setInterval(() => {
    //   connection.socket.send(JSON.stringify({ time: new Date() }))
    // }, 1000)
    console.log(id, 'connected')
    clients.push({
      id,
      connection
    })
    connection.on('close', () => {
      console.log(id, 'disconnected')
      clients.splice(
        clients.findIndex((obj) => obj.id === id),
        1
      )
    })
    connection.socket.on('message', (buf: Buffer) => {
      try {
        const data: any = JSON.parse(buf.toString())
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
        void sendMessage(fastify, data).then((res) => {
          connection.socket.send(
            JSON.stringify(createRequestReturn(200, res, ''))
          )
        })
      } catch (e) {
        connection.socket.send(
          JSON.stringify(createRequestReturn(500, null, ''))
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
