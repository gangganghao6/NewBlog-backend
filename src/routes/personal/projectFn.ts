import { FastifyInstance } from 'fastify'

export async function postProject(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.project.create({
    data: {
      ...data,
      images: {
        create: data.images
      }
    },
    include: {
      images: true
    }
  })
  // const mission = []
  // const projectId = v4()
  // mission.push(
  //   fastify.prisma.project.create({
  //     data: {
  //       id: projectId,
  //       name: data.name,
  //       duty: data.duty,
  //       description: data.description,
  //       time_start: data.time_start,
  //       time_end: data.time_end,
  //       github_url: data.github_url,
  //       demo_url: data.demo_url
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
  //         project_id: projectId
  //       }
  //     })
  //   )
  // }
  // const temp = await fastify.prisma.$transaction(mission)
  // const image = temp[1]
  // const project = temp[0]
  // return {
  //   ...project,
  //   image
  // }
}

export async function getProject(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.project.findUnique({
    where: { id },
    include: {
      images: true
    }
  })
  // const project = await fastify.prisma.project.findUnique({
  //   where: { id }
  // })
  // const image = await fastify.prisma.image.findFirst({
  //   where: { project_id: id }
  // })
  // return {
  //   ...project,
  //   image
  // }
}

export async function getProjectsAll(fastify: FastifyInstance): Promise<any> {
  const projects: any = await fastify.prisma.project.findMany({
    include: {
      images: true
    }
  })
  return projects
}

export async function putProject(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  return await fastify.prisma.project.update({
    where: { id },
    data: {
      ...data,
      images: {
        deleteMany: {},
        create: data.images ?? []
      }
    },
    include: {
      images: true
    }
  })
  // const mission = []
  // let temp: any = {}
  // if ('image' in data) {
  //   mission.push(
  //     fastify.prisma.image.deleteMany({
  //       where: {
  //         project_id: id
  //       }
  //     })
  //   )
  //   if (data.image !== null) {
  //     mission.push(
  //       fastify.prisma.image.create({
  //         data: {
  //           name: data.image.name,
  //           url: data.image.url,
  //           size: data.image.size,
  //           project_id: id
  //         }
  //       })
  //     )
  //   }
  // }
  // if ('name' in data) {
  //   temp = { ...temp, name: data.name }
  // }
  // if ('duty' in data) {
  //   temp = { ...temp, duty: data.duty }
  // }
  // if ('description' in data) {
  //   temp = { ...temp, description: data.description }
  // }
  // if ('time_start' in data) {
  //   temp = { ...temp, time_start: data.time_start }
  // }
  // if ('time_end' in data) {
  //   temp = { ...temp, time_end: data.time_end }
  // }
  // if ('github_url' in data) {
  //   temp = { ...temp, github_url: data.github_url }
  // }
  // if ('demo_url' in data) {
  //   temp = { ...temp, demo_url: data.demo_url }
  // }
  // mission.push(
  //   fastify.prisma.project.update({
  //     where: {
  //       id
  //     },
  //     data: temp
  //   })
  // )
  // await fastify.prisma.$transaction(mission)
  // return await getProject(fastify, id)
}

export async function deleteProject(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.project.delete({
    where: { id }
  })
  // const mission = []
  // mission.push(
  //   fastify.prisma.image.deleteMany({
  //     where: {
  //       project_id: id
  //     }
  //   })
  // )
  // mission.push(
  //   fastify.prisma.project.delete({
  //     where: { id }
  //   })
  // )
  // await fastify.prisma.$transaction(mission)
  // const mission = []
  // const experience = await getProject(fastify, id)
  // if (experience.image !== null) {
  //   mission.push(
  //     fastify.prisma.image.deleteMany({
  //       where: {
  //         project_id: id
  //       }
  //     })
  //   )
  // }
  // mission.push(
  //   fastify.prisma.project.delete({
  //     where: { id }
  //   })
  // )
  // return await fastify.prisma.$transaction(mission)
}
