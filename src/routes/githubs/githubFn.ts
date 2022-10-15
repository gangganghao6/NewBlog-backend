import { FastifyInstance } from 'fastify'
import axios from 'axios'

export async function getGithubAll(
  fastify: FastifyInstance,
  data: any
): Promise<any> {
  return await fastify.prisma.github.findMany({
    take: data.size,
    skip: (data.page - 1) * data.size,
    orderBy: {
      created_time: data.sort
    }
  })
}

export async function getGithubById(
  fastify: FastifyInstance,
  id: string
): Promise<any> {
  return await fastify.prisma.github.findUnique({
    where: { id }
  })
}

export async function updateGithub(fastify: FastifyInstance): Promise<void> {
  try {
    fastify.log.info('Updating Github Data...')
    const mission = []
    const githubName: string = process.env.GITHUB_NAME
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
        page_url: repo.html_url,
        description: repo.description,
        created_time: repo.created_at,
        last_modified_time: repo.pushed_at,
        watchers_count: repo.watchers_count,
        forks_count: repo.forks_count,
        stars_count: repo.stargazers_count,
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