import fs from 'fs'

function generateRoutesLogs(fastify: any): void {
  const obj: any = []
  fastify.routes.forEach((route: any[]) => {
    route.forEach((item) => {
      obj.push(item)
    })
  })
  const routes = obj
    .map((item: any) => {
      if (item.method === 'HEAD') {
        return null
      } else {
        return {
          methods: item.method,
          path: item.path,
          routePath: item.routePath,
          prefix: item.prefix
        }
      }
    })
    .filter((item: any) => item !== null)
  if (!fs.existsSync(`${process.env.PROJECT_PATH as string}/log`)) {
    fs.mkdirSync(`${process.env.PROJECT_PATH as string}/log`)
  }
  fs.writeFileSync(
    `${process.env.PROJECT_PATH as string}/log/routes.json`,
    JSON.stringify(routes)
  )
}

export { generateRoutesLogs }
