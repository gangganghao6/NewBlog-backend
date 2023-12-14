import fs from 'fs'
import dayjs from 'dayjs'
import { Duplex } from 'stream'
import { FastifyInstance } from 'fastify'
import os from 'os'
import { getUserById } from './routes/users/userFn'
import { getRootById } from './routes/base/rootFn'
import lodash from 'lodash'
const { isNil } = lodash

let myFastify: FastifyInstance
function generateRoutesLogs(fastify: any): void {
  myFastify = fastify
  myFastify.log.info(
    `Progress running in ${getProjectPath()} folder, mode:${
      process.env.NODE_ENV
    }`
  )
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
    `${getProjectPath()}\\log\\routes.json`,
    JSON.stringify(routes)
  )
}

function createRequestReturn(
  code = 200,
  data: any = {},
  message = ''
): { code: number; data: any; message: string } {
  if (code !== 200) {
    myFastify.log.error(message)
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
  if (process.env.NODE_ENV.trim() === 'dev') {
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
  if (process.env.NODE_ENV.trim() === 'dev') {
    return true
  }
  if (isNil(id)) throw new Error('管理员尚未登录')
  const root = await getRootById(fastify, id)
  if (root === null) {
    throw new Error('管理员不存在')
  } else {
    fastify.log.info({ root_id: id })
    return true
  }
}

function initMkdir(): void {
  const path = getProjectPath()
  if (!fs.existsSync(`${path}\\.env`)) {
    fs.writeFileSync(`${path}\\.env`, '')
    throw new Error('已自动创建.env文件，需要配置')
  }
  if (!fs.existsSync(`${path}\\log`)) {
    fs.mkdirSync(`${path}\\log`)
  }
  if (!fs.existsSync(`${path}\\log\\normal`)) {
    fs.mkdirSync(`${path}\\log\\normal`)
  }
  if (!fs.existsSync(`${path}\\log\\error`)) {
    fs.mkdirSync(`${path}\\log\\error`)
  }
  if (!fs.existsSync(`${path}\\database`)) {
    fs.mkdirSync(`${path}\\database`)
    throw new Error('需要运行 npm run prisma 命令以创建数据库文件')
  }
  if (!fs.existsSync(`${path}\\public`)) {
    fs.mkdirSync(`${path}\\public`)
  }
  if (!fs.existsSync(`${path}\\frontdist`)) {
    fs.mkdirSync(`${path}\\frontdist`)
  }
  if (!fs.existsSync(`${path}\\public\\files`)) {
    fs.mkdirSync(`${path}\\public\\files`)
  }
  if (!fs.existsSync(`${path}\\public\\temp`)) {
    fs.mkdirSync(`${path}\\public\\temp`)
  }
  // if (!fs.existsSync(`${path}\\public\\images`)) {
  //   fs.mkdirSync(`${path}\\public\\images`)
  // }
  // if (!fs.existsSync(`${path}\\public\\videos`)) {
  //   fs.mkdirSync(`${path}\\public\\videos`)
  // }
}

function getLocalIp(): string {
  let needHost = '' // 打开的host
  try {
    // 获得网络接口列表
    const network = os.networkInterfaces()
    for (const dev in network) {
      const iface = network[dev]!
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i]
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          needHost = alias.address
        }
      }
    }
  } catch (e) {
    needHost = 'localhost'
  }
  return needHost
}

function getProjectPath(): string {
  return process.cwd()
}

export {
  generateRoutesLogs,
  createRequestReturn,
  createLogStream,
  initMkdir,
  getLocalIp,
  getProjectPath
}
