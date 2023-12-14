import { FastifyInstance, FastifyRequest } from 'fastify'
import path from 'path'
import fs, { PathLike } from 'fs'
import lodash from 'lodash'
import { getVideoDurationInSeconds } from 'get-video-duration'
import util from 'util'
import { pipeline } from 'stream'
import { getMediaTypeFromFile, mergeFile } from './utils'
import { getLocalIp, getProjectPath } from '../../utils'
import { FilesChunk, FilesMerge, FilesReturn, Md5Check } from './file_chunk'
// import { Files_chunk } from './file_chunk'

const pump = util.promisify(pipeline)
const { isNil } = lodash

const publicUrl =
  (process.env.NODE_ENV.trim() === 'dev'
    ? getLocalIp()
    : process.env.PUBLIC_URL) +
  ':' +
  process.env.PORT
const basePath = path.join(getProjectPath(), 'public')
let tempInfo: any[] = []

export async function md5Check(md5: string, data: Md5Check): Promise<FilesReturn> {
  const filesFolderPath = path.join(basePath, 'files')
  const filesArr = fs.readdirSync(filesFolderPath)
  const fileName = filesArr.find((file) => file.startsWith(md5))
  if (!isNil(fileName)) {
    const filePath = path.join(filesFolderPath, fileName)
    const mediaType = await getMediaTypeFromFile(filePath)
    const result: any = {
      name: fileName,
      url: `http://${publicUrl}:${process.env.PORT}/public/files/${fileName}`,
      originalName: data.originalName,
      mediaType,
      fileType: data.fileType,
      size: fs.statSync(filePath).size
    }
    if (mediaType === 'videos') {
      result.duration = await getVideoDurationInSeconds(filePath) // 如果是视频，计算视频的时间长度
    }
    return result
  } else {
    throw new Error('文件不存在')
  }
}

export async function uploadFileChunk(md5: string, req: FastifyRequest): Promise<void> {
  let data: FilesChunk = {
    md5,
    totalSlicesNum: 0,
    currentSlicesNum: 0,
    tempFilesPath: ''
  }
  const parts = req.parts()

  for await (const part of parts) {    
    if (!isNil(part.file)) {
      const tempFilePath = path.join(
        basePath,
        'temp',
        `${md5}.${data.currentSlicesNum}.temp`
      )
      data.tempFilesPath = tempFilePath
      const writeStream = fs.createWriteStream(tempFilePath)
      await pump(part.file, writeStream)
      writeStream.close()
    } else {
      const info = JSON.parse((part as unknown as { value: string }).value)
      data = { ...data, ...info } // 将相应的信息添加到data中
    }
  }
  tempInfo.push(data)
}

export async function mergeFileChunk(
  fastify: FastifyInstance,
  md5: string,
  data: FilesMerge
): Promise<FilesReturn> {
  const pathArr: PathLike[] = tempInfo
    .filter((obj) => obj.md5 === md5)
    .map((obj: any) => obj.tempFilesPath)
    .sort(
      (a: any, b: any) =>
        parseInt(a.split('.').at(-2)!) - parseInt(b.split('.').at(-2)!)
    )

  tempInfo = tempInfo.filter((obj) => obj.md5 !== md5) // 删除该文件所有的块
  const fileName = `${md5}.${data.fileType}` // 文件名
  const filePath = path.join(basePath, 'files', fileName)
  const fileUrl = `http://${publicUrl}/public/files/${fileName}` // 文件网络路径
  await mergeFile(fastify, pathArr, filePath) // 合并文件块
  const mediaType = await getMediaTypeFromFile(filePath) // 计算文件类型
  const fileSize = fs.statSync(filePath).size
  let result: any = {
    name: fileName,
    url: fileUrl,
    size: fileSize,
    mediaType,
    fileType: data.fileType,
    originalName: data.originalName
  }
  if (mediaType === 'videos') {
    const duration = await getVideoDurationInSeconds(filePath) // 如果是视频，计算视频的时间长度
    result = { ...result, duration }
  }

  return result
}
