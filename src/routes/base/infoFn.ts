import { FastifyInstance } from 'fastify'
import { BaseInfoModify } from './info'
import { getProjectPath, removeObjNullUndefined } from 'src/utils'
export async function putBaseInfo(
  fastify: FastifyInstance,
  data: BaseInfoModify
): Promise<any> {
  const baseInfo = await getBaseInfo(fastify)
  delete data.headImage?.baseInfoId
  return await fastify.prisma.baseInfo.update({
    where: { id: baseInfo.id },
    data: {
      name: data.name,
      description: data.description,
      recommendBlogIds: data.recommendBlogIds,
      lastModifiedTime: new Date(),
      headImage: {
        ...(baseInfo.headImage && { delete: true }),
        ...({ create: removeObjNullUndefined(data.headImage) })
      }
    }
  })
}
export async function getBaseInfo(fastify: FastifyInstance): Promise<any> {
  const blogsCount = await fastify.prisma.blog.count()
  const commentsCount = await fastify.prisma.comment.count()
  let result = await fastify.prisma.baseInfo.findFirst({
    include: {
      headImage: true
    }
  })
  if (!result) {
    result = await fastify.prisma.baseInfo.create({
      data: {
        name: '',
        description: ''
      },
      include: {
        headImage: true
      }
    })
  }
  result = { ...result, blogsCount, commentsCount }
  await fastify.prisma.baseInfo.update({
    where: { id: result.id },
    data: {
      visitedCount: {
        increment: 1
      }
    }
  })
  return result
}
export async function getSummaryInfo(fastify: FastifyInstance): Promise<any> {
  const baseInfo = await getBaseInfo(fastify)
  const blogCount = await fastify.prisma.blog.count()
  const blogVisitedCount = await fastify.prisma.blog.aggregate({
    _sum: {
      visitedCount: true
    }
  })
  const shuoshuoCount = await fastify.prisma.shuoshuo.count()
  const shuoshuoVisitedCount = await fastify.prisma.shuoshuo.aggregate({
    _sum: {
      visitedCount: true
    }
  })
  const shareFileCount = await fastify.prisma.shareFile.count()
  const shareFileDownloadCount = await fastify.prisma.shareFile.aggregate({
    _sum: {
      downloadCount: true
    }
  })
  const githubCount = await fastify.prisma.github.count()
  const githubVisitedCount = await fastify.prisma.github.aggregate({
    _sum: {
      visitedCount: true
    }
  })
  const payCount = await fastify.prisma.pay.count()
  const payMoneyCount = await fastify.prisma.pay.aggregate({
    _sum: {
      money: true
    }
  })
  const commentCount = await fastify.prisma.comment.count()
  const visitedLogCount = await fastify.prisma.userVisit.count()
  const todoListCount = await fastify.prisma.todolist.count()
  const chatCount = await fastify.prisma.chat.count()
  const userCount = await fastify.prisma.user.count()
  return {
    blogCount,
    shuoshuoCount,
    shareFileCount,
    githubCount,
    payCount,
    blogVisitedCount: blogVisitedCount?._sum?.visitedCount || 0,
    shuoshuoVisitedCount: shuoshuoVisitedCount?._sum?.visitedCount || 0,
    shareFileDownloadCount: shareFileDownloadCount?._sum?.downloadCount || 0,
    githubVisitedCount: githubVisitedCount?._sum?.visitedCount || 0,
    payMoneyCount: payMoneyCount?._sum?.money || 0,
    commentCount,
    visitedLogCount,
    visitedCount: baseInfo.visitedCount,
    todoListCount,
    chatCount,
    userCount
  }
}
export async function updateBaseInfoLastModified(fastify: FastifyInstance) {
  await fastify.prisma.baseInfo.updateMany({
    data: {
      lastModifiedTime: new Date()
    }
  })
}