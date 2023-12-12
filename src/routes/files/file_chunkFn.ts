import { FastifyRequest } from 'fastify'
import path from 'path'
import fs from 'fs'
import lodash from 'lodash'
import { getVideoDurationInSeconds } from 'get-video-duration'
import { createHash, streamToBuffer } from './utils'
import { createRequestReturn, getNetworkIp, getProjectPath } from '../../utils'
import { Files_chunk } from './file_chunk'

const { isNil } = lodash

const basePath = path.join(getProjectPath(), 'public')
let temp: Files_chunk[] = []

export async function uploadFileChunk(req: FastifyRequest): Promise<void> {
  if (temp.length >= 100) {
    temp = []
    throw new Error('内存中的无效file_chunk数量过多，已全部释放，请重新上传')
  }
  let data: Files_chunk = {
    uuid: '',
    totalSlicesNum: 0,
    currentSlicesNum: 0,
    // fileType: '',
    // media_class: 'files',
    fileSlices: Buffer.of()
  }
  const parts = await req.parts()
  for await (const part of parts) {
    if (!isNil(part.file)) {
      data.fileSlices = await streamToBuffer(part.file) // 将文件流转为buffer
    } else {
      const info = JSON.parse((part as unknown as { value: string }).value)
      data = { ...data, ...info } // 将相应的信息添加到data中
    }
  }
  temp.push(data)
}

export async function mergeFileChunk(data: {
  uuid: string
  fileType: string
  mediaType: string
}): Promise<any> {
  const all: Buffer[] = temp
    .filter((obj) => (obj.uuid = data.uuid)) // 将参数对应uuid的文件块过滤出来
    .sort((a, b) => a.currentSlicesNum - b.currentSlicesNum) // 将文件块排好序
    .map((obj) => obj.fileSlices as unknown as Buffer) // 提取出文件块的buffer数据
  const allBuffer = Buffer.concat(all) // 拼接buffer数据
  const fileHash = await createHash(allBuffer) // 计算hash值

  temp = temp.filter((obj) => obj.uuid !== data.uuid) // 删除该文件所有的块

  const fileName = `${fileHash}.${data.fileType}` // 文件名
  const filePath = path.join(basePath, data.mediaType, fileName) // 文件绝对路径
  const fileUrl = `${getNetworkIp()}:${process.env.PORT}/public/${
    data.mediaType
  }/${fileName}` // 文件网络路径
  fs.writeFileSync(filePath, allBuffer)
  const fileSize = fs.statSync(filePath).size
  let result: any = {
    name: fileName,
    url: fileUrl,
    size: fileSize
    // mediaType: data.mediaType,
    // fileType: data.fileType
  }
  if (data.mediaType === 'videos') {
    const duration = await getVideoDurationInSeconds(fileUrl) // 如果是视频，计算视频的时间长度
    result = { ...result, duration }
  }
  return createRequestReturn(200, result, '')
}
