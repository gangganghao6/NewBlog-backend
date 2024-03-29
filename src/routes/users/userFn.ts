import { FastifyInstance } from 'fastify'

// import AliPayForm from 'alipay-sdk/lib/form.js'
import { v4 } from 'uuid'
import dayjs from 'dayjs'
import { getLocalIp } from 'src/utils'



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
    body: '谢谢喵~', // 出售商品的内容,
    // qr_pay_mode: 2
  }
  const orderResult = fastify.alipaySdk.pageExec(`alipay.trade.${data?.isMobile ? 'wap' : 'page'}.pay`, {
    method: 'GET',
    bizContent,
    returnUrl: `http://${(process.env.NODE_ENV.trim() === 'dev'
      ? getLocalIp()
      : process.env.PUBLIC_URL) +
      ':' +
      process.env.PORT as string}/api/users/pay/confirm`
  });
  if (data.type === 'blog') {
    const blog = await fastify.prisma.blog.findFirst({
      where: {
        id: data.blogId
      }
    })
    await fastify.prisma.blog.update({
      where: { id: blog?.id },
      data: {
        pays: {
          create: {
            money: data.money,
            message: data.message,
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
  } else if (data.type === 'personal') {
    const personal = await fastify.prisma.personal.findFirst()
    await fastify.prisma.personal.update({
      where: { id: personal?.id },
      data: {
        pays: {
          create: {
            money: data.money,
            message: data.message,
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
  const resultPay = await fastify.prisma.pay.findFirst({
    where: {
      orderId
    }
  })
  return resultPay
  // return await getPayById(fastify, payId)
}

export async function confirmOrder(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const orderId = data.outTradeNo || data.out_trade_no
  if (orderId === null || orderId === undefined) {
    throw new Error('orderId为空')
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
    const orderUrl = fastify.alipaySdk.pageExec('alipay.trade.query', {
      method: 'GET',
      bizContent: { out_trade_no: orderId },
    });

    const orderResult = await fetch(orderUrl, {
      method: 'GET'
    }).then(async (response) => await response.json())

    const status = orderResult.alipay_trade_query_response?.trade_status // WAIT_BUYER_PAY TRADE_CLOSED TRADE_SUCCESS TRADE_FINISHED
    if (status === 'TRADE_SUCCESS') {
      await fastify.prisma.pay.updateMany({
        where: { orderId },
        data: {
          isClose: true,
          closeTime: new Date(),
          paySuccess: true
        }
      })
      return await fastify.prisma.pay.findFirst({
        where: { orderId }
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
      throw new Error('订单已关闭')
    } else if (status === 'WAIT_BUYER_PAY') {
      await fastify.prisma.pay.updateMany({
        where: { orderId },
        data: {
          isClose: false
        }
      })
      throw new Error('订单未支付')
    } else {
      throw new Error('订单不存在')
    }

  }
}
export async function closePayOrder(
  fastify: FastifyInstance,
  outTradeNo: string
): Promise<any> {
  try {
    await confirmOrder(fastify, { outTradeNo })
  } catch (e) {
    await fastify.prisma.pay.updateMany({
      where: {
        orderId: outTradeNo,
        paySuccess: false
      },
      data: {
        isClose: true,
        closeTime: new Date()
      }
    })
  }
}
export async function getPayAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {

  const countObj = {
    where: {
      id: {
        contains: data.id
      },
      blogId: {
        contains: data.blogId
      },
      isClose: data.isClose === undefined ? undefined : data.isClose === 'false' ? false : true,
      paySuccess: data.paySuccess === undefined ? undefined : data.paySuccess === 'false' ? false : true,
      user: {
        id: {
          contains: data.userId
        },
        email: {
          contains: data.email
        },
        name: {
          contains: data.name
        }
      },
      createdTime: data.createdTimeFrom && {
        gte: dayjs(data.createdTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.createdTimeTo).add(32, 'hour').toDate(),
      }
    }
  }
  const count = await fastify.prisma.pay.count(countObj)
  const result = await fastify.prisma.pay.findMany({
    ...countObj,
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
  })
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
