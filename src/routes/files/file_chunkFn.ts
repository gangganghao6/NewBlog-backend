import { FastifyInstance, FastifyRequest } from 'fastify'
import path from 'path'
import fs, { type PathLike } from 'fs'
import lodash from 'lodash'
import { getVideoDurationInSeconds } from 'get-video-duration'
import util from 'util'
import { pipeline } from 'stream'
import { mergeFile } from './utils'
import { getLocalIp, getProjectPath } from '../../utils'
import { FilesChunkRequest, FilesMergeRequest, FilesMergeReturn, Md5CheckRequest, Md5CheckReturn } from './file_chunk.d'

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

export async function md5Check(md5: string, data: Md5CheckRequest): Promise<Md5CheckReturn> {
  const filesFolderPath = path.join(basePath, 'files')
  const fileName = fs.readdirSync(filesFolderPath).find((file) => file.startsWith(md5))
  if (!isNil(fileName)) {
    const mediaType = data.fileType.split('/')[0]
    const result: Md5CheckReturn = {
      name: fileName,
      url: `http://${publicUrl}/public/files/${fileName}`,
      originalName: data.originalName,
      mediaType,
      fileType: data.fileType,
      fileSuffix: data.fileSuffix,
      size: data.size
    }
    if (mediaType === 'video') {
      result.duration = await getVideoDurationInSeconds(path.join(filesFolderPath, fileName)) // 如果是视频，计算视频的时间长度
    }
    return result
  } else {
    throw new Error('文件不存在')
  }
}

export async function uploadFileChunk(md5: string, req: FastifyRequest): Promise<void> {
  let data: FilesChunkRequest & { tempFilesPath: PathLike, md5: string } = {
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
  data: FilesMergeRequest
): Promise<FilesMergeReturn> {
  const pathArr: PathLike[] = tempInfo
    .filter((obj) => obj.md5 === md5)
    .map((obj: any) => obj.tempFilesPath)
    .sort(
      (a: any, b: any) =>
        parseInt(a.split('.').at(-2)!) - parseInt(b.split('.').at(-2)!)
    )

  tempInfo = tempInfo.filter((obj) => obj.md5 !== md5) // 删除该文件所有的块
  const mediaType = data.fileType.split('/')[0]
  const fileName = `${md5}.${data.fileSuffix}` // 文件名
  const fileUrl = `http://${publicUrl}/public/files/${fileName}` // 文件网络路径
  const filePath = path.join(basePath, 'files', fileName)
  await mergeFile(pathArr, filePath) // 合并文件块
  const result: FilesMergeReturn = {
    name: fileName,
    url: fileUrl,
    size: data.size,
    mediaType,
    fileType: data.fileType,
    fileSuffix: data.fileSuffix,
    originalName: data.originalName
  }
  if (mediaType === 'video') {
    result.duration = await getVideoDurationInSeconds(filePath) // 如果是视频，计算视频的时间长度
  }
  return result
}
