import { FastifyInstance } from 'fastify'
import lodash from 'lodash'

const { isNil } = lodash

export async function postShuoshuo(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.shuoshuo.create({
    data: {
      content: data.content,
      videos: {
        create: data.videos.map((item: any) => {
          return {
            ...item,
            post: {
              create: item.post
            }
          }
        })
      },
      images: {
        create: data.images
      }
    },
    include: {
      videos: {
        include: {
          post: true
        }
      },
      images: true,
      comments: true
    }
  })
  // const shuoshuoId = v4()
  // const mission = []
  // switch (data.media_class) {
  //   case 'images':
  //     for (const image of data.images) {
  //       mission.push(
  //         fastify.prisma.image.create({
  //           data: {
  //             name: image.name,
  //             size: image.size,
  //             url: image.url,
  //             shuoshuo_id: shuoshuoId
  //           }
  //         })
  //       )
  //     }
  //     break
  //   case 'video': {
  //     const videoId = v4()
  //     mission.push(
  //       fastify.prisma.image.create({
  //         data: {
  //           name: data.video.post.name,
  //           url: data.video.post.url,
  //           size: data.video.post.size,
  //           video_id: videoId
  //         }
  //       })
  //     )
  //     mission.push(
  //       fastify.prisma.video.create({
  //         data: {
  //           shuoshuo_id: shuoshuoId,
  //           name: data.video.name,
  //           url: data.video.url,
  //           size: data.video.size,
  //           duration: data.video.duration,
  //           id: videoId
  //         }
  //       })
  //     )
  //     break
  //   }
  // }
  // mission.push(
  //   fastify.prisma.shuoshuo.create({
  //     data: {
  //       media_class: data.media_class,
  //       content: data?.content,
  //       id: shuoshuoId
  //     }
  //   })
  // )
  // await fastify.prisma.$transaction(mission)
  // return await getShuoshuo(fastify, shuoshuoId)
}

export async function getShuoshuo(
  fastify: FastifyInstance,
  id: string,
  update = false
): Promise<any> {
  const shuoshuo: any = await fastify.prisma.shuoshuo.findFirst({
    where: {
      id
    },
    include: {
      videos: {
        include: {
          post: true
        }
      },
      images: true,
      comments: true
    }
  })
  if (update && !isNil(shuoshuo)) {
    // setImmediate(() => {
    fastify.prisma.shuoshuo
      .update({
        where: { id },
        data: {
          visitedCount: {
            increment: 1
          }
        }
      })
      .then()
      .catch((err) => fastify.log.error(err))
    // })
  }
  // switch (shuoshuo.media_class) {
  //   case 'images':
  //     {
  //       const images = await fastify.prisma.image.findMany({
  //         where: {
  //           shuoshuo_id: id
  //         }
  //       })
  //       shuoshuo.images = images
  //     }
  //     break
  //   case 'video':
  //     {
  //       const video = await fastify.prisma.video.findFirst({
  //         where: {
  //           shuoshuo_id: id
  //         }
  //       })
  //       const post = await fastify.prisma.image.findFirst({
  //         where: {
  //           video_id: video?.id
  //         }
  //       })
  //       shuoshuo.video = {
  //         ...video,
  //         post
  //       }
  //     }
  //     break
  // }
  // shuoshuo.comments = await fastify.prisma.comment.findMany({
  //   where: {
  //     shuoshuo_id: id
  //   }
  // })
  return shuoshuo
}

export async function getShuoshuoList(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const count = await fastify.prisma.shuoshuo.count()
  const result = await fastify.prisma.shuoshuo.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      createdTime: data.sort
    },
    include: {
      videos: {
        include: {
          post: true
        }
      },
      images: true,
      comments: true
    }
  })
  // const result = []
  // for (const obj of tempResult) {
  //   result.push(await getShuoshuo(fastify, obj.id))
  // }
  return { result, count }
}

export async function deleteShuoshuo(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.shuoshuo.delete({
    where: { id }
  })
  // const shuoshuo = await getShuoshuo(fastify, id)
  // const mission = []
  // switch (shuoshuo.media_class) {
  //   case 'images':
  //     mission.push(
  //       fastify.prisma.image.deleteMany({
  //         where: {
  //           shuoshuo_id: id
  //         }
  //       })
  //     )
  //     break
  //   case 'video':
  //     {
  //       const video = await fastify.prisma.video.findFirst({
  //         where: { shuoshuo_id: id }
  //       })
  //       mission.push(
  //         fastify.prisma.video.delete({
  //           where: { id: video?.id }
  //         })
  //       )
  //       mission.push(
  //         fastify.prisma.image.deleteMany({
  //           where: { video_id: video?.id }
  //         })
  //       )
  //     }
  //     break
  // }
  // mission.push(
  //   fastify.prisma.comment.deleteMany({
  //     where: { shuoshuo_id: id }
  //   })
  // )
  // mission.push(
  //   fastify.prisma.shuoshuo.delete({
  //     where: { id }
  //   })
  // )
  // return await fastify.prisma.$transaction(mission)
}

export async function putShuoshuo(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  return await fastify.prisma.shuoshuo.update({
    where: { id },
    data: {
      ...data,
      videos: {
        deleteMany: {},
        create:
          data?.videos?.map((item: any) => {
            return {
              ...item,
              post: {
                create: item.post
              }
            }
          }) ?? []
      },
      images: {
        deleteMany: {},
        create: data.images ?? []
      },
      comments: {
        deleteMany: {},
        create: data.comments ?? []
      }
    },
    include: {
      videos: {
        include: {
          post: true
        }
      },
      images: true,
      comments: true
    }
  })
  // const mission = []
  // if ('content' in data) {
  //   mission.push(
  //     fastify.prisma.shuoshuo.update({
  //       where: { id },
  //       data: {
  //         content: data.content
  //       }
  //     })
  //   )
  // }
  // if ('images' in data && data.images !== null) {
  //   mission.push(
  //     fastify.prisma.image.deleteMany({
  //       where: {
  //         shuoshuo_id: id
  //       }
  //     })
  //   )
  //   for (const image of data.images) {
  //     mission.push(
  //       fastify.prisma.image.create({
  //         data: {
  //           name: image.name,
  //           size: image.size,
  //           url: image.url,
  //           shuoshuo_id: id
  //         }
  //       })
  //     )
  //   }
  // }
  // if ('video' in data) {
  //   const video = await fastify.prisma.video.findFirst({
  //     where: { shuoshuo_id: id }
  //   })
  //   mission.push(
  //     fastify.prisma.image.deleteMany({
  //       where: {
  //         video_id: video?.id
  //       }
  //     })
  //   )
  //   mission.push(
  //     fastify.prisma.video.delete({
  //       where: {
  //         id: video?.id
  //       }
  //     })
  //   )
  //   const videoId = v4()
  //   mission.push(
  //     fastify.prisma.image.create({
  //       data: {
  //         name: data.video.post.name,
  //         url: data.video.post.url,
  //         size: data.video.post.size,
  //         video_id: videoId
  //       }
  //     })
  //   )
  //   mission.push(
  //     fastify.prisma.video.create({
  //       data: {
  //         id: videoId,
  //         shuoshuo_id: id,
  //         name: data.video.name,
  //         url: data.video.url,
  //         size: data.video.size,
  //         duration: data.video.duration
  //       }
  //     })
  //   )
  // }
  // if ('media_class' in data) {
  //   mission.push(
  //     fastify.prisma.shuoshuo.update({
  //       where: { id },
  //       data: {
  //         media_class: data.media_class
  //       }
  //     })
  //   )
  // }
  // mission.push(
  //   fastify.prisma.shuoshuo.update({
  //     where: { id },
  //     data: { last_modified_time: new Date() }
  //   })
  // )
  // await fastify.prisma.$transaction(mission)
  // return await getShuoshuo(fastify, id)
}
