import { FastifyRequest } from 'fastify'
import { createHash, streamToBuffer } from './utils'
import fs from 'fs'
import path from 'path'
import { createRequestReturn } from '../../utils'
import { Files_chunk } from '../../types/files'
import { getVideoDurationInSeconds } from 'get-video-duration'

const basePath = path.join(process.env.PROJECT_PATH, 'public')
let temp: Files_chunk[] = []

export async function uploadFileChunk(req: FastifyRequest): Promise<any> {
  if (temp.length >= 100) {
    temp = []
    throw new Error('内存中的无效file_chunk数量过多，已全部释放，请重新上传')
  }
  const data: Files_chunk = {
    uuid: '',
    total_slices: 0,
    current_slices: 0,
    file_type: '',
    media_class: '',
    file_slices: Buffer.of()
  }
  const parts = await req.parts()
  for await (const part of parts) {
    if (part.file !== undefined) {
      data.file_slices = await streamToBuffer(part.file)
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      data[part.fieldname] = JSON.parse(part.value)[part.fieldname]
    }
  }
  temp.push(data)
  return createRequestReturn(200, null, '')
}

export async function mergeFileChunk(data: {
  uuid: string
  file_type: string
  media_class: string
}): Promise<any> {
  const all: Buffer[] = temp
    .filter((obj) => (obj.uuid = data.uuid))
    .sort((a, b) => a.current_slices - b.current_slices)
    .map((obj) => obj.file_slices as unknown as Buffer)
  // console.log(all)
  const allBuffer = Buffer.concat(all)
  const fileHash = await createHash(allBuffer)

  temp = temp.filter((obj) => obj.uuid !== data.uuid)

  const fileName = `${fileHash}.${data.file_type}`
  const filePath = path.join(basePath, data.media_class, fileName)
  const fileUrl = `${process.env.PUBLIC_URL}:${process.env.PORT}/public/${data.media_class}/${fileName}`
  fs.writeFileSync(filePath, allBuffer)
  const fileSize = fs.statSync(filePath).size
  let result: any = {
    name: fileName,
    url: fileUrl,
    size: fileSize
  }
  if (data.media_class === 'videos') {
    const duration = await getVideoDurationInSeconds(fileUrl)
    result = { ...result, duration }
  }
  return createRequestReturn(200, result, '')
}
