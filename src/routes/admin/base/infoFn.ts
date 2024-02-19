import { FastifyInstance } from 'fastify'
import lodash from 'lodash'
import fs from 'fs'
import path from 'path'
import { BaseInfoCreate, BaseInfoModify } from './info'
import { BaseInfo } from 'src/types/model'
import { getProjectPath } from 'src/utils'
const { isNil } = lodash
export async function postBaseInfo(
  fastify: FastifyInstance,
  data: BaseInfoCreate
): Promise<any> {
  if (isNil(data.name)) {
    throw new Error('缺少博客名称')
  }
  let headImage
  if (!isNil(data.headImage)) {
    headImage = await fastify.prisma.image.create({
      data: data.headImage
    })
  }
  return await editBaseInfo({
    name: data.name,
    headImage: isNil(headImage)
      ? undefined
      : {
          name: headImage.name,
          url: headImage.url,
          size: headImage.size
        }
  })
  // const baseInfoId = v4()
  // const mission = []
  // mission.push(
  //   fastify.prisma.image.create({
  //     data: {
  //       name: data.head_image.name,
  //       url: data.head_image.url,
  //       baseinfo_id: baseInfoId,
  //       size: data.head_image.size
  //     }
  //   })
  // )
  // mission.push(
  //   fastify.prisma.baseInfo.create({
  //     data: {
  //       id: baseInfoId,
  //       name: data.name
  //     }
  //   })
  // )
  // const result = await fastify.prisma.$transaction(mission)
  // const headImage = result[0]
  // const baseInfo = result[1]

  // return {
  //   ...baseInfo,
  //   head_image: headImage
  // }
}

export async function putBaseInfo(
  fastify: FastifyInstance,
  data: BaseInfoModify,
  baseInfo: BaseInfo
): Promise<any> {
  return await editBaseInfo(data)
  // const mission = []
  // if ('head_image' in data) {
  //   mission.push(
  //     fastify.prisma.image.updateMany({
  //       where: {
  //         baseinfo_id: baseInfo.id
  //       },
  //       data: data.head_image
  //     })
  //   )
  // }
  // if ('name' in data) {
  //   mission.push(
  //     fastify.prisma.baseInfo.update({
  //       where: {
  //         id: baseInfo.id
  //       },
  //       data: {
  //         name: data.name
  //       }
  //     })
  //   )
  // }
  // mission.push(
  //   fastify.prisma.baseInfo.update({
  //     where: { id: baseInfo.id },
  //     data: { last_modified_time: new Date() }
  //   })
  // )
  // await fastify.prisma.$transaction(mission)
  // const temp = (await fastify.prisma.baseInfo.findFirst()) as BaseInfo
  // return await getBaseInfo(fastify, temp)
}
export function getBaseInfo(): BaseInfo {
  return JSON.parse(
    fs.readFileSync(
      path.join(getProjectPath(), 'config/baseInfo.json'),
      'utf-8'
    )
  )
}
export async function editBaseInfo(
  data: BaseInfoModify
): Promise<BaseInfoModify> {
  const baseInfo = { ...getBaseInfo(), ...data }
  fs.writeFileSync(
    path.join(getProjectPath(), 'config/baseInfo.json'),
    JSON.stringify(baseInfo)
  )
  return baseInfo
}
