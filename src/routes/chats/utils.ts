import { FastifyInstance } from "fastify"
import { createRequestReturn } from "src/utils"

export const sendOnlineCount = async (fastify: FastifyInstance) => {
  fastify.websocketServer.clients.forEach((obj) => {
    obj.send(JSON.stringify(createRequestReturn(200, { type: 'boardcast', onLineCount: fastify.websocketServer.clients.size }, '')))
  })
}