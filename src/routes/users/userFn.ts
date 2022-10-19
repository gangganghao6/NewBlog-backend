import { FastifyInstance } from 'fastify'
import AliPaySdk from 'alipay-sdk'
import AliPayForm from 'alipay-sdk/lib/form'
import { v4 } from 'uuid'
import { getBlog } from '../blogs/blogFn'

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
      is_subscribed: data.is_subscribed,
      is_banned: data.is_banned
    }
  })
  const result = await fastify.prisma.user.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      created_time: data.sort
    },
    where: {
      is_subscribed: data.is_subscribed,
      is_banned: data.is_banned
    }
  })
  return { result, count }
}

export async function getUserDetail(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const user = await getUserById(fastify, id)
  const chats = await fastify.prisma.chat.findMany({
    where: {
      user_id: id
    }
  })
  const userVisits = await fastify.prisma.userVisit.findMany({
    where: { user_id: id }
  })
  const comments = await fastify.prisma.comment.findMany({
    where: { user_id: id }
  })
  const pays = await fastify.prisma.pay.findMany({
    where: { user_id: id }
  })
  return {
    ...user,
    chats,
    user_visit: userVisits,
    comments,
    pays
  }
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
    `${process.env.PUBLIC_URL}/api/users/pay/confirm`
  )
  formData.addField('bizContent', {
    outTradeNo: orderId, // 订单号
    productCode: 'FAST_INSTANT_TRADE_PAY', // 产品码
    totalAmount: data.money, // 商品金额
    subject: data.type === 'blog' ? '博客打赏' : '个人打赏', // 出售商品的标题
    body: '谢谢喵~' // 出售商品的内容
  })
  const orderResult = await alipaySdk.exec(
    'alipay.trade.page.pay',
    {},
    { formData }
  )
  return await fastify.prisma.pay.create({
    data: {
      id: v4(),
      type: data.type,
      money: data.money,
      order_id: orderId,
      order_url: orderResult,
      pay_type: data.pay_type,
      user_id: data.user_id,
      blog_id:
        data.blog_id === null || data.blog_id === undefined
          ? data.blog_id
          : null
    }
  })
}

export async function confirmOrder(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const orderId = data.out_trade_no
  const exist = await fastify.prisma.pay.findFirst({
    where: { order_id: orderId }
  })
  if (exist === null) {
    throw new Error('订单不存在')
  } else if (exist?.is_close) {
    return await fastify.prisma.pay.findFirst({
      where: { order_id: orderId }
    })
  } else {
    // eslint-disable-next-line new-cap,@typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line new-cap
    const formData = new AliPayForm.default()
    formData.setMethod('get')
    formData.addField('bizContent', {
      out_trade_no: orderId
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
    const status = orderResult.alipay_trade_query_response.trade_status // WAIT_BUYER_PAY TRADE_CLOSED TRADE_SUCCESS TRADE_FINISHED
    if (status === 'TRADE_SUCCESS') {
      await fastify.prisma.pay.updateMany({
        where: { order_id: orderId },
        data: {
          is_close: true,
          close_time: new Date(),
          pay_success: true
        }
      })
    } else if (status === 'TRADE_CLOSED') {
      await fastify.prisma.pay.updateMany({
        where: { order_id: orderId },
        data: {
          is_close: true,
          close_time: new Date(),
          pay_success: false
        }
      })
    } else if (status === 'WAIT_BUYER_PAY') {
      await fastify.prisma.pay.updateMany({
        where: { order_id: orderId },
        data: {
          is_close: false
        }
      })
    }
    return await fastify.prisma.pay.findFirst({
      where: { order_id: orderId }
    })
  }
}

export async function getPayAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const count = await fastify.prisma.pay.count()
  const tempResult = await fastify.prisma.pay.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      created_time: data.sort
    },
    select: {
      id: true
    }
  })
  const result = []
  for (const obj of tempResult) {
    result.push(await getPayById(fastify, obj.id))
  }
  return { result, count }
}

export async function getPayById(
  fastify: FastifyInstance,
  id: any
): Promise<any> {
  const result: any = await fastify.prisma.pay.findUnique({ where: { id } })
  result.user = await getUserById(fastify, id)
  if (result?.type === 'blog') {
    result.blog = await getBlog(fastify, result.blog_id)
  }
  return result
}
