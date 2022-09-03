import Fastify from 'fastify'
import * as fs from 'fs'
import * as path from 'path'
import cors from '@fastify/cors'

interface LocalConfig {
  projectPath: string
  port: number
}

const localConfig: LocalConfig = JSON.parse(
  fs.readFileSync(path.join(path.resolve(), 'localConfig.json'), {
    encoding: 'utf8'
  })
)
const fastify = Fastify({
  logger: true,
  http2: true,
  https: {
    allowHTTP1: true,
    cert: fs.readFileSync(path.join(localConfig.projectPath, 'keys/cert.crt')),
    key: fs.readFileSync(path.join(localConfig.projectPath, 'keys/cert.key'))
  }
})
await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

fastify.get('/api/', async (request, reply) => {
  return { hello: 'world' }
})

/**
 * Run the server!
 */
const start = async (): Promise<void> => {
  try {
    await fastify.listen({
      port: localConfig.port,
      host: '0.0.0.0'
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

await start()
