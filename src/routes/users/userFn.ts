import { FastifyInstance } from 'fastify'
import AliPaySdk from 'alipay-sdk'
import AliPayForm from 'alipay-sdk/lib/form.js'
import { v4 } from 'uuid'

// eslint-disable-next-line new-cap,@typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line new-cap
const alipaySdk = new AliPaySdk.default({
  appId: process.env.ALIPAY_APPID, // 自己的id
  gateway: 'https://openapi.alipaydev.com/gateway.do', // 这是支付宝官网沙箱测试网关
  privateKey: process.env.ALIPAY_PRIVATEKEY,
  alipayPublicKey: process.env.ALIPAY_PUBLICKEY
})

export async function getUserById(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.user.findUnique({
    where: { id }
  })
}

export async function getUserByEmail(
  fastify: FastifyInstance,
  email: string
): Promise<any> {
  // if (email === undefined) {
  //   throw new Error('参数错误')
  // }
  return await fastify.prisma.user.findFirst({
    where: { email }
  })
}

export async function createUser(
  fastify: FastifyInstance,
  data: { email: string; name: string }
): Promise<any> {
  return await fastify.prisma.user.create({
    data
  })
}

export async function putUser(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  return await fastify.prisma.user.update({
    where: { id },
    data
  })
}

export async function getUserAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const count = await fastify.prisma.user.count({
    where: {
      isSubscribed: data.isSubscribed,
      isBanned: data.isBanned
    }
  })
  const result = await fastify.prisma.user.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      createdTime: data.sort
    },
    where: {
      isSubscribed: data.isSubscribed,
      isBanned: data.isBanned
    }
  })
  return { result, count }
}

export async function getUserDetail(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.user.findUnique({
    where: {
      id
    },
    include: {
      comments: true,
      userVisits: true,
      chats: true,
      pays: true
    }
  })
}

export async function createPayOrder(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  // eslint-disable-next-line new-cap,@typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line new-cap
  const formData = new AliPayForm.default()
  const orderId = v4()
  formData.setMethod('get')
  formData.addField(
    'returnUrl',
    `${process.env.PUBLICURL as string}/api/users/pay/confirm`
  )
  formData.addField('bizContent', {
    outTradeNo: orderId, // 订单号
    productCode: 'FASTINSTANTTRADE_PAY', // 产品码
    totalAmount: data.money, // 商品金额
    subject: data.type === 'blog' ? '博客打赏' : '个人打赏', // 出售商品的标题
    body: '谢谢喵~' // 出售商品的内容
  })
  const orderResult = await alipaySdk.exec(
    'alipay.trade.page.pay',
    {},
    { formData }
  )
  const mission = []
  if (data.blogId !== null && data.blogId !== undefined) {
    const blog = await fastify.prisma.blog.findUnique({
      where: {
        id: data.blogId
      }
    })
    if (blog !== null) {
      mission.push(
        fastify.prisma.blog.update({
          where: { id: blog.id },
          data: {
            paysCount: blog.paysCount + 1
          }
        })
      )
    }
  }
  const payId = v4()
  mission.push(
    fastify.prisma.pay.create({
      data: {
        id: payId,
        // type: data.type,
        money: data.money,
        orderId,
        orderUrl: orderResult,
        payType: data.payType,
        userId: data.userId,
        blogId:
          data.blogId === null || data.blogId === undefined ? null : data.blogId
      }
    })
  )
  await fastify.prisma.$transaction(mission)
  return await getPayById(fastify, payId)
}

export async function confirmOrder(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const orderId = data.outTrade_no
  if (orderId === null || orderId === undefined) {
    throw new Error('参数错误')
  }
  const exist = await fastify.prisma.pay.findFirst({
    where: { orderId }
  })
  if (exist === null) {
    throw new Error('订单不存在')
  } else if (exist?.isClose) {
    return await fastify.prisma.pay.findFirst({
      where: { orderId }
    })
  } else {
    // eslint-disable-next-line new-cap,@typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line new-cap
    const formData = new AliPayForm.default()
    formData.setMethod('get')
    formData.addField('bizContent', {
      outTrade_no: orderId
    })
    // 通过该接口主动查询订单状态
    const orderUrl = await alipaySdk.exec(
      'alipay.trade.query',
      {},
      { formData }
    )
    const orderResult = await fetch(orderUrl, {
      method: 'GET'
    }).then(async (response) => await response.json())
    const status = orderResult.alipayTrade_query_response.trade_status // WAIT_BUYER_PAY TRADE_CLOSED TRADE_SUCCESS TRADE_FINISHED
    if (status === 'TRADE_SUCCESS') {
      await fastify.prisma.pay.updateMany({
        where: { orderId },
        data: {
          isClose: true,
          closeTime: new Date(),
          paySuccess: true
        }
      })
    } else if (status === 'TRADE_CLOSED') {
      await fastify.prisma.pay.updateMany({
        where: { orderId },
        data: {
          isClose: true,
          closeTime: new Date(),
          paySuccess: false
        }
      })
    } else if (status === 'WAIT_BUYER_PAY') {
      await fastify.prisma.pay.updateMany({
        where: { orderId },
        data: {
          isClose: false
        }
      })
    }
    return await fastify.prisma.pay.findFirst({
      where: { orderId }
    })
  }
}

export async function getPayAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const count = await fastify.prisma.pay.count()
  const result = await fastify.prisma.pay.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      createdTime: data.sort
    },
    include: {
      user: true,
      blog: true,
      personal: true
    }
    // select: {
    //   id: true
    // }
  })
  // const result = []
  // for (const obj of tempResult) {
  //   result.push(await getPayById(fastify, obj.id))
  // }
  return { result, count }
}

export async function getPayById(
  fastify: FastifyInstance,
  id: any
): Promise<any> {
  return await fastify.prisma.pay.findUnique({
    where: { id },
    include: {
      user: true,
      blog: true,
      personal: true
    }
  })
  // result.user = await getUserById(fastify, id)
  // if (result?.type === 'blog') {
  //   try {
  //     result.blog = await getBlog(fastify, result.blogId)
  //   } catch (e) {
  //     result.blog = null
  //   }
  // }
}
