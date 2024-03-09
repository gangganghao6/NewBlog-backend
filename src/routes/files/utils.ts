import fs, { WriteStream, type PathLike } from 'fs'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { getProjectPath } from 'src/utils'
const basePath = path.join(getProjectPath(), 'public')

export async function mergeFile(arr: PathLike[], target: string): Promise<any> {
  const writeStream = fs.createWriteStream(target)
  for (const path of arr) {
    await mergeFileInner(path, writeStream)
  }
  writeStream.close()
}

async function mergeFileInner(
  path: PathLike,
  writeStream: WriteStream
): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    const reader = fs.createReadStream(path)
    reader.pipe(writeStream, { end: false })
    reader.on('end', () => {
      reader.close()
      resolve(true)
    })
  })
}

export function deleteTempFilesByMd5(
  fastify: FastifyInstance,
  md5: string
): void {
  const tempFolderPath = path.join(basePath, 'temp')
  const files = fs.readdirSync(tempFolderPath)
  files.forEach((file) => {
    if (file.startsWith(md5)) {
      fs.rm(path.join(tempFolderPath, file), (err) => {
        if (err != null) {
          fastify.log.error(err)
        }
      })
    }
  })
}
