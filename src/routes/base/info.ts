import { BaseInfo } from '../../types/model'

export default function (fastify: any, options: any, done: any): void {
  fastify.get('/info', {}, async (req: any, res: any) => {
    const result: BaseInfo | null = await fastify.prisma.baseInfo.findFirst({
      where: {
        id: 1
      },
      include: {
        head_image: {
          select: {
            id: true,
            name: true,
            url: true,
            created_time: true
          }
        }
      }
    })
    delete result?.password
    if (result === null) {
      throw new Error('您还没有初始化博客信息')
    }
    return {
      status: 200,
      data: result,
      message: ''
    }
  })
  fastify.post('/info', {}, async (req: any, res: any) => {
    const data: BaseInfo = req.body
    let result: BaseInfo = await fastify.prisma.baseInfo.findFirst({
      where: {
        id: 1
      }
    })
    if (result === null) {
      await fastify.prisma.baseInfo.create({
        data: {
          name: data.name,
          account: data.account,
          password: data.password,
          email: data.email,
          head_image: {
            create: {
              name: data.head_image.name,
              url: data.head_image.url
            }
          }
        }
      })
      result = await fastify.prisma.baseInfo.findFirst({
        where: {
          id: 1
        }
      })
    }
    delete result.password
    return {
      status: 200,
      data: result,
      message: ''
    }
  })
  fastify.put('/info', {}, async (req: any, res: any) => {
    let data: BaseInfo | any = req.body
    if ('head_image' in data) {
      data = { ...data, head_image: { create: data.head_image } }
    }
    const result = await fastify.prisma.baseInfo.update({
      where: { id: 1 },
      data,
      include: {
        head_image: {
          select: {
            id: true,
            name: true,
            url: true,
            created_time: true
          }
        }
      }
    })
    return {
      status: 200,
      data: result,
      message: ''
    }
  })
  done()
}
