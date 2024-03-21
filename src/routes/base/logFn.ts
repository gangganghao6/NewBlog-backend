import { FastifyInstance } from 'fastify'
import parser from 'ua-parser-js'
import IP2Region from 'ip2region'
import dayjs from 'dayjs'

// eslint-disable-next-line new-cap,@typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line new-cap
const query = new IP2Region.default({
  disableIpv6: true
})

export async function postUserVisitLog(
  fastify: FastifyInstance,
  data: { data: { url: string }; ip: string; userAgent: any, userId: string | undefined }
): Promise<any> {
  const result = parser(data.userAgent)
  const location: {
    country: string
    province: string
    city: string
    isp: string
  } = query.search(data.ip)

  void fastify.prisma.userVisit
    .create({
      data: {
        ip: data.ip,
        country: location.country === '' ? null : location.country,
        province: location.province === '' ? null : location.province,
        city: location.city === '' ? null : location.city,
        isp: location.isp === '' ? null : location.isp,
        url: data.data.url,
        userAgent: data.userAgent,
        browserName: result.browser.name,
        browserVersion: result.browser.version,
        browserMajor: result.browser.major,
        engineName: result.engine.name,
        engineVersion: result.engine.version,
        osName: result.os.name,
        osVersion: result.os.version,
        deviceVendor: result.device.vendor,
        deviceModel: result.device.model,
        deviceType: result.device.type,
        cpuArchitecture: result.cpu.architecture,
        ...(data.userId && {
          user: {
            connect: {
              id: data.userId
            }
          }
        })
      },
    })
    .then()
    .catch((err) => fastify.log.error(err))
  return null
}

export async function getUserVisitAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const countObj = {
    where: {
      url: {
        contains: data.url
      },
      id: {
        contains: data.id
      },
      ...((data.userId || data.userName || data.email) && {
        user: {
          id: {
            contains: data.userId
          },
          name: {
            contains: data.userName
          },
          email: {
            contains: data.email
          }
        }
      }),
      visitTime: data.visitTimeFrom && {
        gte: dayjs(data.visitTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.visitTimeTo).add(32, 'hour').toDate(),
      },
    }
  }
  const count = await fastify.prisma.userVisit.count(countObj)
  const result = await fastify.prisma.userVisit.findMany({
    ...countObj,
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      visitTime: data.sort
    },
    include: {
      user: true
    }
  })
  return { result, count }
}
export async function getUserVisit(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return fastify.prisma.userVisit.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  })
}
export async function deleteUserVisit(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return fastify.prisma.userVisit.delete({
    where: {
      id
    }
  })
}
export async function
  getUserVisitAnalysis(
    fastify: FastifyInstance
  ): Promise<any> {
  const browserNames: any = {}
  const engineNames: any = {}
  const osNames: any = {}
  const deviceTypes: any = {}
  const cpuArchitectures: any = {}
  const visitTimes: any = {}
  const countrys: any = {}
  const provinces: any = {}
  const citys: any = {}
  const isps: any = {}
  const userIds: any = {}
  const urls: any = {}
  const ips: any = {}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const total: Array<{
    browserName: string
    engineName: string
    osName: string
    deviceType: string
    cpuArchitecture: string
    country: string
    province: string
    city: string
    isp: string
    visitTime: string
    userId: string
    url: string
    ip: string
  }> = await fastify.prisma.userVisit.findMany()
  total.forEach((data) => {
    proceedCurrency(browserNames, data, 'browserName')
    proceedCurrency(engineNames, data, 'engineName')
    proceedCurrency(osNames, data, 'osName')
    proceedCurrency(deviceTypes, data, 'deviceType')
    proceedCurrency(cpuArchitectures, data, 'cpuArchitecture')
    proceedCurrency(countrys, data, 'country')
    proceedCurrency(provinces, data, 'province')
    proceedCurrency(citys, data, 'city')
    proceedCurrency(isps, data, 'isp')
    proceedCurrency(userIds, data, 'userId')
    const time = dayjs(data.visitTime).format('YYYY-MM-DD')
    proceedCurrency(visitTimes, { visitTime: time }, 'visitTime')
    proceedCurrency(ips, data, 'ip')
    proceedCurrency(urls, data, 'url')
  })
  return {
    browserNames,
    engineNames,
    osNames,
    deviceTypes,
    cpuArchitectures,
    countrys,
    provinces,
    citys,
    userIds,
    visitTimes,
    isps,
    ips,
    urls
  }
}

function proceedCurrency(origin: any, data: any, target: string): void {
  origin[data[target]] =
    origin[data[target]] === undefined
      ? 1
      : (origin[data[target]] as number) + 1
}
