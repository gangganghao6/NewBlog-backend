import crypto from 'crypto'
import { Stream } from 'stream'

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
