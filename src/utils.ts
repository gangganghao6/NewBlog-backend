import fs from 'fs'
import dayjs from 'dayjs'
import { Duplex } from 'stream'
import { FastifyInstance } from 'fastify'
import { getUserById } from './routes/users/userFn'
import { getRootById } from './routes/base/rootFn'

function generateRoutesLogs(fastify: any): void {
  const obj: any = []
  fastify.routes.forEach((route: any[]) => {
    route.forEach((item) => {
      obj.push(item)
    })
  })
  const routes = obj
    .map((item: any) => {
      if (item.method === 'HEAD') {
        return null
      } else {
        return {
          methods: item.method,
          path: item.path,
          routePath: item.routePath,
          prefix: item.prefix
        }
      }
    })
    .filter((item: any) => item !== null)
  fs.writeFileSync(
    `${process.env.PROJECT_PATH}\\log\\routes.json`,
    JSON.stringify(routes)
  )
}

function createRequestReturn(
  code = 200,
  data: any = {},
  message = ''
): { code: number; data: any; message: string } {
  return {
    code,
    data,
    message
  }
}

function createLogStream(): Duplex {
  const currentDate = dayjs(new Date()).format('YYYY-MM-DD')
  if (!fs.existsSync(`${process.env.PROJECT_PATH}/log`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}/log`)
  }
  if (!fs.existsSync(`${process.env.PROJECT_PATH}/log/normal`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}/log/normal`)
  }
  if (!fs.existsSync(`${process.env.PROJECT_PATH}/log/error`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}/log/error`)
  }
  const logStream = fs.createWriteStream(`./log/normal/${currentDate}.txt`, {
    encoding: 'utf8'
  })
  const errStream = fs.createWriteStream(`./log/error/${currentDate}.txt`, {
    encoding: 'utf8'
  })
  const inoutStream: Duplex = new Duplex({
    write(chunk, encoding, callback) {
      const data = JSON.parse(chunk.toString())
      delete data.pid
      delete data.reqId
      delete data.hostname
      data.time = dayjs(data.time).format('YYYY-MM-DD HH:mm:ss')
      if ('err' in data) {
        const stack = decodeURIComponent(data.err.stack)
        delete data.err
        delete data.msg
        console.log(JSON.stringify(data))
        console.log(`ERROR:${stack}\n`)
        errStream.write(JSON.stringify(data))
        logStream.write(JSON.stringify(data))
        errStream.write(`ERROR:${stack}\n`)
      } else {
        console.log(JSON.stringify(data))
        logStream.write(JSON.stringify(data) + '\n')
      }
      callback()
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    read(): void {}
  })
  return inoutStream
}

export async function validateUser(
  fastify: FastifyInstance,
  id: string | null | undefined
): Promise<boolean> {
  if (id === null || id === undefined) throw new Error('用户尚未登录')
  const user = await getUserById(fastify, id)
  if (user === null) {
    throw new Error('用户不存在')
  } else if (user.is_banned === true) {
    throw new Error('用户已被禁止登录')
  } else return true
}

export async function validateRoot(
  fastify: FastifyInstance,
  id: string | null | undefined
): Promise<boolean> {
  if (id === null || id === undefined) throw new Error('管理员尚未登录')
  const root = await getRootById(fastify, id)
  if (root === null) {
    throw new Error('管理员不存在')
  } else return true
}

export { generateRoutesLogs, createRequestReturn, createLogStream }
