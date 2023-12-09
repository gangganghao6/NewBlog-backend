import { FastifyInstance } from 'fastify'
import nodemailer from 'nodemailer'
import lodash from 'lodash'
const { isNil } = lodash

export async function postBlog(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const result = await fastify.prisma.blog.create({
    data: {
      ...data,
      images: {
        create: data.images
      },
      post: {
        create: data.post
      }
    },
    include: {
      images: true,
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
  // const mission = []
  // const blogId = v4()
  // if ('post' in data && data.post !== null) {
  //   mission.push(
  //     fastify.prisma.image.create({
  //       data: { ...data.post, blogpost_id: blogId }
  //     })
  //   )
  // }
  // if ('images' in data && data.images !== null && data.images.length > 0) {
  //   for (const image of data.images) {
  //     mission.push(
  //       fastify.prisma.image.create({
  //         data: { ...image, blogimages_id: blogId }
  //       })
  //     )
  //   }
  // }
  // mission.push(
  //   fastify.prisma.blog.create({
  //     data: {
  //       id: blogId,
  //       title: data.title,
  //       content: data.content,
  //       type: data.type
  //     }
  //   })
  // )
  // await fastify.prisma.$transaction(mission)
  // const result = await getBlog(fastify, blogId)
  if (process.env.NODE_ENV.trim() === 'dev') {
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
  const countObj: any = {}
  const searchObj: any = {
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      createdTime: data.sort
    },
    include: {
      images: true,
      post: true
    }
  }
  if (!isNil(data.type)) {
    countObj.where = {
      type: {
        equals: data.type
      }
    }
    searchObj.where = {
      type: {
        equals: data.type
      }
    }
  }
  const count = await fastify.prisma.blog.count(countObj)
  const result = await fastify.prisma.blog.findMany(searchObj)
  // let result, count
  // if (!('type' in data)) {
  //   count = await fastify.prisma.blog.count()
  //   result = await fastify.prisma.blog.findMany({
  //     take: data.size,
  //     skip: (data.page - 1) * data.size,
  //     // select: {
  //     //   id: true
  //     // },
  //     orderBy: {
  //       createdTime: data.sort
  //     },
  //     include: {
  //       images: true,
  //       post: true
  //     }
  //   })
  // } else {
  //   count = await fastify.prisma.blog.count({
  //     where: {
  //       type: {
  //         equals: data.type
  //       }
  //     }
  //   })
  //   result = await fastify.prisma.blog.findMany({
  //     where: {
  //       type: {
  //         equals: data.type
  //       }
  //     },
  //     take: data.size,
  //     skip: (data.page - 1) * data.size,
  //     // select: {
  //     //   id: true
  //     // },
  //     orderBy: {
  //       createdTime: data.sort
  //     },
  //     include: {
  //       images: true,
  //       post: true
  //     }
  //   })
  // }
  // const result = []
  // for (const obj of tempResult) {
  //   result.push(await getBlog(fastify, obj.id))
  // }
  return { result, count }
}

export async function getBlog(
  fastify: FastifyInstance,
  id: string,
  update = false
): Promise<any> {
  // const blog = await fastify.prisma.blog.findFirst({
  //   where: { id }
  // })
  if (update) {
    void fastify.prisma.blog.update({
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
      images: true,
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
  // setImmediate(() => {
  //   void fastify.prisma.blog
  //     .update({
  //       where: { id },
  //       data: {
  //         visitedCount: blog.visitedCount + 1
  //       }
  //     })
  //     .then()
  //     .catch((err) => fastify.log.error(err))
  // })
  // }
  // const post = await fastify.prisma.image.findFirst({
  //   where: { blogpost_id: id }
  // })
  // const images = await fastify.prisma.image.findMany({
  //   where: { blogimages_id: id }
  // })
  // const comments = await fastify.prisma.comment.findMany({
  //   where: { blog_id: id }
  // })
  // const pays = await fastify.prisma.pay.findMany({
  //   where: { blog_id: id }
  // })
  // return {
  //   ...blog,
  //   post,
  //   images,
  //   comments,
  //   pays
  // }
}

export async function deleteBlog(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  await fastify.prisma.blog.update({
    where: { id },
    data: {
      pays: {
        disconnect: true
      },
      comments: {
        disconnect: true
      }
    }
  })
  return await fastify.prisma.blog.delete({ where: { id } })
  // const mission = []
  // mission.push(
  //   fastify.prisma.image.deleteMany({
  //     where: { blogpost_id: id }
  //   })
  // )
  // mission.push(
  //   fastify.prisma.image.deleteMany({ where: { blogimages_id: id } })
  // )
  // mission.push(
  //   fastify.prisma.comment.deleteMany({
  //     where: { blog_id: id }
  //   })
  // )
  // mission.push(
  //   fastify.prisma.blog.delete({
  //     where: { id }
  //   })
  // )
  // // pay不删除
  // return await fastify.prisma.$transaction(mission)
}

export async function putBlog(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  return await fastify.prisma.blog.update({
    where: { id },
    data: {
      ...data,
      lastModifiedTime: new Date(),
      post: {
        deleteMany: {},
        create: data.post
      },
      images: {
        deleteMany: {},
        create: data.images
      }
      // comments: {
      //   deleteMany: {},
      //   create: data.comments.map((item: any) => {
      //     return {
      //       ...item,
      //       user: {
      //         connect: {
      //           id: item.user.id
      //         }
      //       }
      //     }
      //   })
      // }
    }
  })
  // const mission = []

  // if ('post' in data && data.post !== null && data.post !== undefined) {
  //   mission.push(
  //     fastify.prisma.image.deleteMany({
  //       where: { blogpost_id: id }
  //     })
  //   )
  //   mission.push(
  //     fastify.prisma.image.create({
  //       data: { ...data.post, blogpost_id: id }
  //     })
  //   )
  // }
  // if ('images' in data && data.images !== null && data.images !== undefined) {
  //   mission.push(
  //     fastify.prisma.image.deleteMany({
  //       where: { blogimages_id: id }
  //     })
  //   )
  //   for (const image of data.images) {
  //     mission.push(
  //       fastify.prisma.image.create({
  //         data: { ...image, blogimages_id: id }
  //       })
  //     )
  //   }
  // }
  // let temp = {}
  // if ('title' in data && data.title !== null && data.title !== undefined) {
  //   temp = { ...temp, title: data.title }
  // }
  // if (
  //   'content' in data &&
  //   data.content !== null &&
  //   data.content !== undefined
  // ) {
  //   temp = { ...temp, content: data.content }
  // }
  // if ('type' in data && data.type !== null && data.type !== undefined) {
  //   temp = { ...temp, type: data.type }
  // }
  // mission.push(
  //   fastify.prisma.blog.update({
  //     where: { id },
  //     data: { ...temp, last_modified_time: new Date() }
  //   })
  // )
  // await fastify.prisma.$transaction(mission)
  // return await getBlog(fastify, id)
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
