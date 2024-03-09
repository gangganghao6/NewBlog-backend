import { FastifyInstance } from 'fastify'
import nodemailer from 'nodemailer'
import lodash from 'lodash'
import comments from '../base/comments'
import dayjs from 'dayjs'
const { isNil } = lodash

export async function postBlog(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  delete data.post.uid

  const result = await fastify.prisma.blog.create({
    data: {
      ...data,
      post: {
        create: data.post
      }
    },
    include: {
      post: true,
      comments: {
        include: {
          user: true
        }
      },
      pays: {
        include: {
          user: true
        }
      }
    }
  })
  if (process.env.NODE_ENV.trim() === 'prod') {
    void checkSubscribe(fastify)
      .then((str) => {
        const title: string = result.title
        const content: string = result.content
        const time: Date = result.createdTime
        void sendMail(
          fastify,
          str,
          `标题：${title}\n内容：${content}\n发表于：${time.toLocaleString()}`
        )
      })
      .catch((err) => {
        fastify.log.error(err)
      })
  }
  return result
}

export async function getBlogList(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const countObj: any = {
    where: {
      id: {
        contains: data.id
      },
      title: {
        contains: data.title
      },
      content: {
        contains: data.content
      },
      type: {
        contains: data.type
      },
      createdTime: data.createdTimeFrom && {
        gte: dayjs(data.createdTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.createdTimeTo).add(32, 'hour').toDate(),
      },
      lastModifiedTime: data.lastModifiedTimeFrom && {
        gte: dayjs(data.lastModifiedTimeFrom).add(8, 'hour').toDate(),
        lte: dayjs(data.lastModifiedTimeTo).add(32, 'hour').toDate(),
      }
    },
  }
  const searchObj: any = {
    ...countObj,
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      lastModifiedTime: data.sort
    },

    include: {
      post: true,
      comments: true,
      pays: true,
    }
  }
  const count = await fastify.prisma.blog.count(countObj)
  const result = await fastify.prisma.blog.findMany(searchObj)
  return { result, count }
}

export async function getBlog(
  fastify: FastifyInstance,
  id: string,
  update = false
): Promise<any> {
  if (update) {
    await fastify.prisma.blog.update({
      where: { id },
      data: {
        visitedCount: {
          increment: 1
        }
      }
    })
  }
  return await fastify.prisma.blog.findFirst({
    where: { id },
    include: {
      post: true,
      comments: {
        include: {
          user: true
        }
      },
      pays: {
        include: {
          user: true
        }
      }
    }
  })
}

export async function deleteBlog(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const result = await fastify.prisma.blog.delete({
    where: { id },
  })
  return result
}

export async function putBlog(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  delete data.post.uid
  delete data.post.blogPostId
  delete data.post.id
  data.post.size = parseInt(data.post.size, 10)

  return await fastify.prisma.blog.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      type: data.type,
      lastModifiedTime: new Date(),
      post: {
        delete: true,
        create: data.post
      },
    }
  })
}
export async function createBlogComment(
  fastify: FastifyInstance,
  data: {
    blogId: string
    comment: string
    userId: string
  }
): Promise<any> {
  return await fastify.prisma.blog.update({
    where: { id: data.blogId },
    data: {
      comments: {
        create: {
          comment: data.comment,
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
export async function deleteBlogComment(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.blog.update({
    where: { id: data.blogId },
    data: {
      comments: {
        delete: {
          id: data.commentId
        }
      }
    }
  })
}
export async function checkSubscribe(fastify: FastifyInstance): Promise<any> {
  const result = await fastify.prisma.user.findMany({
    where: { isSubscribed: true },
    select: { email: true }
  })
  if (result.length <= 0) {
    throw new Error('没有用户订阅')
  }
  const allUsersEmail = result.map((user) => user.email)
  return allUsersEmail.join(',')
}

export async function sendMail(
  fastify: FastifyInstance,
  userEmail: string,
  message: string
): Promise<any> {
  // 创建Nodemailer传输器 SMTP 或者 其他 运输机制
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST, // 第三方邮箱的主机地址
    port: parseInt(process.env.EMAIL_SMTP_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SMTP_ACCOUNT, // 发送方邮箱的账号
      pass: process.env.EMAIL_SMTP_PASS // 邮箱授权密码
    }
  })

  // 定义transport对象并发送邮件
  const info = await transporter.sendMail({
    from: process.env.EMAIL_SMTP_ACCOUNT, // 发送方邮箱的账号
    to: userEmail, // 邮箱接受者的账号
    subject: '您订阅的博客更新啦', // Subject line
    text: message // 文本内容
    // html: '欢迎注册h5.dooring.cn, 您的邮箱验证码是:<b>${emailCode}</b>' // html 内容, 如果设置了html内容, 将忽略text内容
  })
  fastify.log.info(JSON.stringify(info))
}
export async function getBlogType(fastify: FastifyInstance): Promise<any> {
  let result: any = await fastify.prisma.blog.findMany({
    select: {
      type: true
    }
  })
  return Array.from(new Set(result.map((item: { type: any }) => item.type)))
}
