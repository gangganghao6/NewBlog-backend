import { FastifyInstance } from 'fastify'
import { getExperiencesAll } from './experienceFn'
import { getProjectsAll } from './projectFn'

export async function postPersonalInfo(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.personal.create({
    data
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
  const missions = []
  missions.push(fastify.prisma.personal.findFirst())
  missions.push(getProjectsAll(fastify))
  missions.push(getExperiencesAll(fastify))
  const result = await Promise.all(missions)
  return { personal: result[0], projects: result[1], experiences: result[2] }
  // const projects = await getProjectsAll(fastify)
  // const experiences = await getExperiencesAll(fastify)
  // const pays = await fastify.prisma.pay.findMany()
  // const comments = await fastify.prisma.comment.findMany({
  //   where: { personal_id: { not: null } }
  // })
  // if (info !== null && info !== undefined) {
  //   setImmediate(() => {
  //     void fastify.prisma.personal
  //       .update({
  //         where: { id: info.id },
  //         data: { visits_count: info.visits_count + 1 }
  //       })
  //       .then()
  //       .catch((err) => fastify.log.error(err))
  //   })
  // }
  // return {
  //   ...info,
  //   projects,
  //   experiences,
  //   pays,
  //   comments
  // }
}
