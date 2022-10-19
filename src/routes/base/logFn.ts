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
  data: { data: any[]; ip: string; userAgent: any }
): Promise<any> {
  const result = parser(data.userAgent)
  const location: {
    country: string
    province: string
    city: string
    isp: string
  } = query.search(data.ip)
  for (const obj of data.data) {
    await fastify.prisma.userVisit.create({
      data: {
        ip: obj.ip,
        country: location.country === '' ? null : location.country,
        province: location.province === '' ? null : location.province,
        city: location.city === '' ? null : location.city,
        isp: location.isp === '' ? null : location.isp,
        url: obj.url,
        user_agent: data.userAgent,
        user_id: obj.user_id,
        browser_name: result.browser.name,
        browser_version: result.browser.version,
        browser_major: result.browser.major,
        engine_name: result.engine.name,
        engine_version: result.engine.version,
        os_name: result.os.name,
        os_version: result.os.version,
        device_vendor: result.device.vendor,
        device_model: result.device.model,
        device_type: result.device.type,
        cpu_architecture: result.cpu.architecture
      }
    })
  }

  return null
}

export async function getUserVisitAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const count = fastify.prisma.userVisit.count()
  const result = await fastify.prisma.userVisit.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      visit_time: data.sort
    }
  })
  return { result, count }
}

export async function getUserVisitAnalysis(
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
    browser_name: string
    engine_name: string
    os_name: string
    device_type: string
    cpu_architecture: string
    country: string
    province: string
    city: string
    isp: string
    visit_time: string
    user_id: string
    url: string
    ip: string
  }> = await fastify.prisma.userVisit.findMany()
  total.forEach((data) => {
    proceedCurrency(browserNames, data, 'browser_name')
    proceedCurrency(engineNames, data, 'engine_name')
    proceedCurrency(osNames, data, 'os_name')
    proceedCurrency(deviceTypes, data, 'device_type')
    proceedCurrency(cpuArchitectures, data, 'cpu_architecture')
    proceedCurrency(countrys, data, 'country')
    proceedCurrency(provinces, data, 'province')
    proceedCurrency(citys, data, 'city')
    proceedCurrency(isps, data, 'isp')
    proceedCurrency(userIds, data, 'user_id')
    const time = dayjs(data.visit_time).format('YYYY-MM-DD')
    proceedCurrency(visitTimes, { visit_time: time }, 'visit_time')
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
