import crypto from 'crypto'
import {
  fileTypeFromFile,
} from 'file-type'
import fs, { WriteStream, type PathLike } from 'fs'
import { FastifyInstance } from 'fastify'

export async function createHash(buffer: crypto.BinaryLike): Promise<string> {
  const fsHash = crypto.createHash('md5')
  fsHash.update(buffer)
  return fsHash.digest('hex')
}

export async function getMediaTypeFromFile(url: string): Promise<string> {
  const mediaType = await fileTypeFromFile(url)
  if (mediaType?.mime?.startsWith('image') === true) {
    return 'images'
  } else if (mediaType?.mime?.startsWith('video') === true) {
    return 'videos'
  } else {
    return 'files'
  }
}
export async function mergeFile(
  fastify: FastifyInstance,
  arr: PathLike[],
  target: string
): Promise<any> {
  const writeStream = fs.createWriteStream(target)
  for (const path of arr) {
    await mergeFileInner(path, writeStream)
    fs.rm(path, (err) => {
      if (err != null) {
        fastify.log.error(err)
      }
    })
  }
  writeStream.close()
}

async function mergeFileInner(path: PathLike, writeStream: WriteStream): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    const reader = fs.createReadStream(path)
    reader.pipe(writeStream, { end: false })
    reader.on('end', () => {
      resolve(true)
    })
  })
}
