import crypto from 'crypto'
import { Stream } from 'stream'
import { fileTypeFromBuffer } from 'file-type'

export async function createHash(buffer: crypto.BinaryLike): Promise<string> {
  const fsHash = crypto.createHash('md5')
  fsHash.update(buffer)
  return fsHash.digest('hex')
}

export async function streamToBuffer(stream: Stream): Promise<Buffer> {
  return await new Promise((resolve, reject) => {
    const buffers: Buffer[] = []
    stream.on('error', reject)
    stream.on('data', (data) => buffers.push(data))
    stream.on('end', () => resolve(Buffer.concat(buffers)))
  })
}
export async function getMediaType(buffer: Buffer): Promise<string> {
  const mediaType = await fileTypeFromBuffer(buffer)
  if (mediaType?.mime?.startsWith('image') === true) {
    return 'images'
  } else if (mediaType?.mime?.startsWith('video') === true) {
    return 'videos'
  } else {
    return 'files'
  }
}
