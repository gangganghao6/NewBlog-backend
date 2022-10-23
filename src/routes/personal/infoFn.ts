import { FastifyInstance } from 'fastify'
import { getExperiencesAll } from './experienceFn'
import { getProjectsAll } from './projectFn'

export async function postPersonalInfo(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.personal.create({
    data: {
      name: data.name,
      sex: data.sex,
      birthday: data.birthday, // 2020-01-31T00:00:00.000Z
      wechat: data.wechat,
      qq: data.qq,
      github: data.github,
      university: data.university,
      university_end_time: data.university_end_time, // 2020-01-31T00:00:00.000Z
      home: data.home,
      readme: data.readme
    }
  })
}

export async function putPersonalInfo(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const result = await fastify.prisma.personal.findFirst({
    select: { id: true }
  })
  return await fastify.prisma.personal.update({
    where: { id: result?.id },
    data
  })
}

export async function getPersonalInfoAll(
  fastify: FastifyInstance
): Promise<any> {
  const info = await fastify.prisma.personal.findFirst()
  const projects = await getProjectsAll(fastify)
  const experiences = await getExperiencesAll(fastify)
  const pays = await fastify.prisma.pay.findMany()
  const comments = await fastify.prisma.comment.findMany({
    where: { personal_id: { not: null } }
  })
  if (info !== null && info !== undefined) {
    setImmediate(() => {
      void fastify.prisma.personal
        .update({
          where: { id: info.id },
          data: { visits_count: info.visits_count + 1 }
        })
        .then()
        .catch((err) => fastify.log.error(err))
    })
  }
  return {
    ...info,
    projects,
    experiences,
    pays,
    comments
  }
}
