import crypto from 'crypto'
import {
  fileTypeFromFile,
} from 'file-type'
import fs, { WriteStream, type PathLike } from 'fs'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { getProjectPath } from 'src/utils'
const basePath = path.join(getProjectPath(), 'public')

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
  }
  writeStream.close()
}

async function mergeFileInner(path: PathLike, writeStream: WriteStream): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    const reader = fs.createReadStream(path)
    reader.pipe(writeStream, { end: false })
    reader.on('end', () => {
      reader.close()
      resolve(true)
    })
  })
}

export function deleteTempFilesByMd5(md5: string): void {
  const tempFolderPath = path.join(basePath, 'temp')
  const files = fs.readdirSync(tempFolderPath)
  files.forEach((file) => {
    if (file.startsWith(md5)) {
      fs.rmSync(`${tempFolderPath}\\${file}`)
    }
  })
}