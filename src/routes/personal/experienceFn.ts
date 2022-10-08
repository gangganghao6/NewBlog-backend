import { FastifyInstance } from 'fastify'
import { v4 } from 'uuid'

export async function postExperience(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const mission = []
  const experienceId = v4()
  mission.push(
    fastify.prisma.experience.create({
      data: {
        id: experienceId,
        company: data.company,
        duty: data.duty,
        description: data.description,
        time_start: data.time_start,
        time_end: data.time_end
      }
    })
  )
  if ('image' in data && data.image !== null) {
    mission.push(
      fastify.prisma.image.create({
        data: {
          name: data.image.name,
          url: data.image.url,
          size: data.image.size,
          experience_id: experienceId
        }
      })
    )
  }
  return await fastify.prisma.$transaction(mission)
}

export async function getExperience(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const experience = await fastify.prisma.experience.findUnique({
    where: { id }
  })
  const image = await fastify.prisma.image.findFirst({
    where: { experience_id: id }
  })
  return {
    ...experience,
    image
  }
}

export async function getExperiencesAll(
  fastify: FastifyInstance
): Promise<any> {
  const experiences: any = await fastify.prisma.experience.findMany()
  for (const experience of experiences) {
    experience.image = await fastify.prisma.image.findFirst({
      where: { experience_id: experience.id }
    })
  }
  return experiences
}

export async function putExperience(
  fastify: FastifyInstance,
  data: any,
  id: string
): Promise<any> {
  const mission = []
  let temp: any = {}
  if ('image' in data) {
    mission.push(
      fastify.prisma.image.deleteMany({
        where: {
          experience_id: id
        }
      })
    )
    if (data.image !== null) {
      mission.push(
        fastify.prisma.image.create({
          data: {
            name: data.image.name,
            url: data.image.url,
            size: data.image.size,
            experience_id: id
          }
        })
      )
    }
  }
  if ('company' in data) {
    temp = { ...temp, company: data.company }
  }
  if ('duty' in data) {
    temp = { ...temp, duty: data.duty }
  }
  if ('description' in data) {
    temp = { ...temp, description: data.description }
  }
  if ('time_start' in data) {
    temp = { ...temp, time_start: data.time_start }
  }
  if ('time_end' in data) {
    temp = { ...temp, time_end: data.time_end }
  }
  mission.push(
    fastify.prisma.experience.update({
      where: {
        id
      },
      data: temp
    })
  )
  await fastify.prisma.$transaction(mission)
  return await getExperience(fastify, id)
}

export async function deleteExperience(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  const mission = []
  const experience = await getExperience(fastify, id)
  if (experience.image !== null) {
    mission.push(
      fastify.prisma.image.deleteMany({
        where: {
          experience_id: id
        }
      })
    )
  }
  mission.push(
    fastify.prisma.experience.delete({
      where: { id }
    })
  )
  return await fastify.prisma.$transaction(mission)
}
