import { FastifyInstance } from 'fastify'
import AliPaySdk from 'alipay-sdk'
import AliPayForm from 'alipay-sdk/lib/form.js'
import { v4 } from 'uuid'
import dayjs from 'dayjs'
import { getLocalIp } from 'src/utils'

// eslint-disable-next-line new-cap,@typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line new-cap
const alipaySdk = new AliPaySdk.default({
  appId: process.env.ALIPAY_APPID, // 自己的id
  gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do', // 这是支付宝官网沙箱测试网关
  privateKey: process.env.ALIPAY_PRIVATEKEY,
  alipayPublicKey: process.env.ALIPAY_PUBLICKEY
})

// export async function getUserDetail(
//   fastify: FastifyInstance,
//   id: string
// ): Promise<any> {
//   return await fastify.prisma.user.findUnique({
//     where: { id }
//   })
// }

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
  const countObj = {
    where: {
      id: {
        contains: data.id
      },
      email: {
        contains: data.email
      },
      name: {
        contains: data.name
      },
      ...(data.isBanned && { isBanned: data.isBanned === 'false' ? false : true }),
      ...(data.isSubscribed && { isSubscribed: data.isSubscribed === 'false' ? false : true }),
      createdTime: data.createdTimeFrom && {
        gte: dayjs(data.createdTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.createdTimeTo).add(32, 'hour').toDate(),
      }
    },
  }
  const searchObj = {
    ...countObj,
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      createdTime: data.sort
    }
  }
  const count = await fastify.prisma.user.count(countObj)
  const result = await fastify.prisma.user.findMany(searchObj)
  return { result, count }
}

export async function getUserDetail(
  fastify: FastifyInstance,
  id: string | undefined
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
  const orderId = v4()
  const bizContent = {
    out_trade_no: orderId, // 订单号
    product_code: 'FAST_INSTANT_TRADE_PAY', // 产品码
    total_amount: data.money, // 商品金额
    subject: data.type === 'blog' ? '博客打赏' : '个人打赏', // 出售商品的标题
    body: '谢谢喵~' // 出售商品的内容
  }
  const orderResult = alipaySdk.pageExec('alipay.trade.page.pay', {
    method: 'GET',
    bizContent,
    returnUrl: `http://${(process.env.NODE_ENV.trim() === 'dev'
      ? getLocalIp()
      : process.env.PUBLIC_URL) +
      ':' +
      process.env.PORT as string}/api/users/pay/confirm`
  });
  if (data.blogId !== null && data.blogId !== undefined) {
    const blog = await fastify.prisma.blog.findFirst({
      where: {
        id: data.blogId
      }
    })
    if (blog !== null) {
      await fastify.prisma.blog.update({
        where: { id: blog.id },
        data: {
          pays: {
            create: {
              money: data.money,
              orderId,
              orderUrl: orderResult,
              payType: data.payType,
              user: {
                connect: {
                  id: data.userId
                }
              }
            }
          }
        }
      })
    }
  }
  return orderResult
  // return await getPayById(fastify, payId)
}

export async function confirmOrder(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const orderId = data.outTradeNo
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
      out_rade_no: orderId
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
