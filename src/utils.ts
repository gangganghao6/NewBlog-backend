import fs from 'fs'
import dayjs from 'dayjs'
import { Duplex } from 'stream'
import { FastifyInstance } from 'fastify'
import { getUserById } from './routes/users/userFn'
import { getRootById } from './routes/base/rootFn'
import { fastify } from './index'
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
  if (code !== 200) {
    fastify.log.error(message)
  }
  return {
    code,
    data,
    message
  }
}

let currentDate = dayjs(new Date()).format('YYYY-MM-DD')
let logStream = fs.createWriteStream(`./log/normal/${currentDate}.txt`, {
  encoding: 'utf8',
  flags: 'a+'
})
let errStream = fs.createWriteStream(`./log/error/${currentDate}.txt`, {
  encoding: 'utf8',
  flags: 'a+'
})

setInterval(() => {
  currentDate = dayjs(new Date()).format('YYYY-MM-DD')
  logStream.close(() => {
    logStream = fs.createWriteStream(`./log/normal/${currentDate}.txt`, {
      encoding: 'utf8',
      flags: 'a+'
    })
  })
  errStream.close(() => {
    errStream = fs.createWriteStream(`./log/error/${currentDate}.txt`, {
      encoding: 'utf8',
      flags: 'a+'
    })
  })
}, 1000 * 60 * 60 * 24)

function createLogStream(): Duplex {
  const inoutStream: Duplex = new Duplex({
    write(chunk, encoding, callback) {
      const data = JSON.parse(chunk.toString())
      delete data.pid
      delete data.reqId
      delete data.hostname
      data.time = dayjs(data.time).format('YYYY-MM-DD HH:mm:ss')
      const dataStr = JSON.stringify(data).replaceAll('\\n', '\n')
      // if (!isNil(data.err)) {
      //   const stack = decodeURIComponent(data.err.stack)
      //   delete data.err
      //   delete data.msg
      //   console.log(JSON.stringify(data))
      //   console.log("ERROR:" + stack)
      //   errStream.write(JSON.stringify(data) + '\n')
      //   logStream.write(JSON.stringify(data) + '\n')
      //   errStream.write(`ERROR:${stack}\n`)
      // } else
      if (data.level === 50) {
        console.log(dataStr)
        errStream.write(dataStr + '\n')
      } else {
        console.log(dataStr)
        logStream.write(dataStr + '\n')
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
  if (process.env.ISDEV === 'true') {
    return true
  }
  if (id === null || id === undefined) throw new Error('用户尚未登录')
  const user = await getUserById(fastify, id)
  if (user === null) {
    throw new Error('用户不存在')
  } else if (user.is_banned === true) {
    throw new Error('用户已被禁止登录')
  } else {
    fastify.log.info({ user_id: id })
    return true
  }
}

export async function validateRoot(
  fastify: FastifyInstance,
  id: string | null | undefined
): Promise<boolean> {
  if (process.env.ISDEV === 'true') {
    return true
  }
  if (id === null || id === undefined) throw new Error('管理员尚未登录')
  const root = await getRootById(fastify, id)
  if (root === null) {
    throw new Error('管理员不存在')
  } else {
    fastify.log.info({ root_id: id })
    return true
  }
}

function initMkdir(): void {
  if (!fs.existsSync(`${process.env.PROJECT_PATH}\\.env`)) {
    fs.writeFileSync(`${process.env.PROJECT_PATH}\\.env`, '')
    throw new Error('已自动创建.env文件，需要配置')
  }
  if (!fs.existsSync(`${process.env.PROJECT_PATH}\\log`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}\\log`)
  }
  if (!fs.existsSync(`${process.env.PROJECT_PATH}\\log\\normal`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}\\log\\normal`)
  }
  if (!fs.existsSync(`${process.env.PROJECT_PATH}\\log\\error`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}\\log\\error`)
  }
  if (!fs.existsSync(`${process.env.PROJECT_PATH}\\database`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}\\database`)
    throw new Error('需要运行 npm run prisma 命令以创建数据库文件')
  }
  if (!fs.existsSync(`${process.env.PROJECT_PATH}\\public`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}\\public`)
  }
  if (!fs.existsSync(`${process.env.PROJECT_PATH}\\public\\files`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}\\public\\files`)
  }
  if (!fs.existsSync(`${process.env.PROJECT_PATH}\\public\\images`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}\\public\\images`)
  }
  if (!fs.existsSync(`${process.env.PROJECT_PATH}\\public\\videos`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH}\\public\\videos`)
  }
}

export { generateRoutesLogs, createRequestReturn, createLogStream, initMkdir }
