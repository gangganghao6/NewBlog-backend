import { FastifyInstance } from 'fastify'
import axios from 'axios'
import lodash from 'lodash'
import { getPersonalInfoAll } from '../personal/infoFn'
const { isNil } = lodash

export async function getGithubAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  const count = await fastify.prisma.github.count()
  const result = await fastify.prisma.github.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      lastModifiedTime: data.sort
    }
  })
  return { result, count }
}

export async function getGithubById(
  fastify: FastifyInstance,
  id: string,
  update = false
): Promise<any> {
  const github = await fastify.prisma.github.findUnique({
    where: { id }
  })
  if (update && !isNil(github)) {
    // setImmediate(() => {
    void fastify.prisma.github
      .update({
        where: { id },
        data: {
          visitedCount: github.visitedCount + 1
        }
      })
      .then()
      .catch((err) => fastify.log.error(err))
    // })
  }
  return github
}

export async function updateGithub(fastify: FastifyInstance): Promise<void> {
  try {
    fastify.log.info('Updating Github Data...')
    const mission = []
    const personal = await getPersonalInfoAll(fastify)
    const githubName: string = personal.personal.githubName
    if (isNil(githubName)) {
      throw new Error('请先初始化个人信息')
    }
    const githubRepos: any = await axios.get(
      `https://api.github.com/users/${githubName}/repos`,
      {
        params: {
          sort: 'pushed'
        },
        timeout: 20000
      }
    )
    const tempRepos = githubRepos.data.map((repo: any) => {
      return {
        title: repo.name,
        pageUrl: repo.html_url,
        description: repo.description,
        createdTime: repo.created_at,
        lastModifiedTime: repo.pushed_at,
        watchersCount: repo.watchers_count,
        forksCount: repo.forks_count,
        starsCount: repo.stargazers_count,
        languages: repo.language
      }
    })
    mission.push(fastify.prisma.github.deleteMany())
    for (const repo of tempRepos) {
      mission.push(
        fastify.prisma.github.create({
          data: repo
        })
      )
    }
    await fastify.prisma.$transaction(mission)
    fastify.log.info('Github Data Updated Successfully!')
  } catch (e) {
    fastify.log.error(e)
  }
}
