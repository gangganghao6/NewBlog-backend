export default function (
  fastify: any,
  { prisma }: { prisma: any },
  done: any
): void {
  // fastify.get('/info', async (req: any, res: any) => {
  //   await prisma.Image.create({
  //     data: {
  //       name: 'test.png',
  //       url: 'https://pic1.zhimg.com/50/v2-fa5cd5d62e3b337fc1aea686fa035bc4_b.jpg'
  //     }
  //   })
  //   const result = await prisma.Image.findMany({})
  //   await res.setCookie('test.png', '111')
  //   return result
  // })
  done()
}
