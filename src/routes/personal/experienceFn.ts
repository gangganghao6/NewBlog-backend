import { FastifyInstance } from 'fastify'

export async function postExperience(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.experience.create({
    data: {
      company: data.company,
      duty: data.duty,
      description: data.description,
      timeStart: data.timeStart,
      timeEnd: data.timeEnd,
      images: {
        create: data.images
      }
    },
    include: {
      images: true
    }
  })
  // const mission = []
  // const experienceId = v4()
  // mission.push(
  //   fastify.prisma.experience.create({
  //     data: {
  //       id: experienceId,
  //       company: data.company,
  //       duty: data.duty,
  //       description: data.description,
  //       timeStart: data.timeStart,
  //       timeEnd: data.timeEnd
  //     }
  //   })
  // )
  // if ('image' in data && data.image !== null) {
  //   mission.push(
  //     fastify.prisma.image.create({
  //       data: {
  //         name: data.image.name,
  //         url: data.image.url,
  //         size: data.image.size,
  //         experience_id: experienceId
  //       }
  //     })
  //   )
  // }
  // return await fastify.prisma.$transaction(mission)
}

export async function getExperience(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.experience.findUnique({
    where: { id },
    include: {
      images: true
    }
  })
}

export async function getExperiencesAll(
  fastify: FastifyInstance
): Promise<any> {
  return await fastify.prisma.experience.findMany({
    include: {
      images: true
    }
  })
}

export async function putExperience(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  return await fastify.prisma.experience.update({
    where: { id },
    data: {
      ...data,
      images: {
        deleteMany: {},
        create: data.images
      }
    },
    include: {
      images: true
    }
  })
  //   const mission = []
  //   let temp: any = {}
  //   if ('image' in data) {
  //     mission.push(
  //       fastify.prisma.image.deleteMany({
  //         where: {
  //           experience_id: id
  //         }
  //       })
  //     )
  //     if (data.image !== null) {
  //       mission.push(
  //         fastify.prisma.image.create({
  //           data: {
  //             name: data.image.name,
  //             url: data.image.url,
  //             size: data.image.size,
  //             experience_id: id
  //           }
  //         })
  //       )
  //     }
  //   }
  //   if ('company' in data) {
  //     temp = { ...temp, company: data.company }
  //   }
  //   if ('duty' in data) {
  //     temp = { ...temp, duty: data.duty }
  //   }
  //   if ('description' in data) {
  //     temp = { ...temp, description: data.description }
  //   }
  //   if ('timeStart' in data) {
  //     temp = { ...temp, timeStart: data.timeStart }
  //   }
  //   if ('timeEnd' in data) {
  //     temp = { ...temp, timeEnd: data.timeEnd }
  //   }
  //   mission.push(
  //     fastify.prisma.experience.update({
  //       where: {
  //         id
  //       },
  //       data: temp
  //     })
  //   )
  //   await fastify.prisma.$transaction(mission)
  //   return await getExperience(fastify, id)
}

export async function deleteExperience(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.experience.delete({
    where: { id }
  })
  // const mission = []
  // const experience = await getExperience(fastify, id)
  // if (experience.image !== null) {
  //   mission.push(
  //     fastify.prisma.image.deleteMany({
  //       where: {
  //         experience_id: id
  //       }
  //     })
  //   )
  // }
  // mission.push(
  //   fastify.prisma.experience.delete({
  //     where: { id }
  //   })
  // )
  // return await fastify.prisma.$transaction(mission)
}
