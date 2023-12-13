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
  missions.push(
    fastify.prisma.personal.findFirst({
      include: {
        comments: {
          include: {
            user: true
          }
        }
      }
    })
  )
  missions.push(getProjectsAll(fastify))
  missions.push(getExperiencesAll(fastify))
  const result = await Promise.all(missions)
  setImmediate(async () => {
    await fastify.prisma.personal.update({
      where: { id: result[0].id },
      data: {
        visitedCount: {
          increment: 1
        }
      }
    })
  })
  result[0].project = result[1]
  result[0].experience = result[2]
  return { ...result[0] }
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
