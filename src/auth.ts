import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { getUserDetail } from "src/routes/users/userFn"
import { getRootById } from "src/routes/base/rootFn"
import lodash from "lodash"
const { isNil } = lodash
export async function validateUser(
    fastify: FastifyInstance,
    req: FastifyRequest,
    res: FastifyReply
): Promise<void> {
    // if (process.env.NODE_ENV.trim() === 'dev') {
    //     return void 0
    // }
    if (req.headers.referer?.includes('/admin')) {
        return void 0
    }
    const id = req.session.userId
    if (isNil(id)) {
        create401Response(res, '用户尚未登录')
    }
    const user = await getUserDetail(fastify, id)
    if (user === null) {
        create401Response(res, '用户不存在')
    } else if (user.isBanned === true) {
        create500Response(res, '用户已被封禁')
    } else {
        fastify.log.info({ userId: id })
    }
}

export async function validateRoot(
    fastify: FastifyInstance,
    req: FastifyRequest,
    res: FastifyReply
): Promise<void> {
    // if (process.env.NODE_ENV.trim() === 'dev') {
    //     return void 0
    // }
    if (req.headers.referer?.includes('/front')) {
        return void 0
    }

    const id = req.session.adminId
    if (isNil(id)) {
        create401Response(res, '管理员尚未登录')
    }
    const root = await getRootById(fastify, id)
    if (root === null) {
        create401Response(res, '管理员不存在')
    } else {
        fastify.log.info({ adminId: id })
    }
}
export async function validateBoth(
    fastify: FastifyInstance,
    req: FastifyRequest,
    res: FastifyReply
) {
    const adminId = req.session.adminId
    const userId = req.session.userId
    if (isNil(adminId) && isNil(userId)) {
        create401Response(res, '用户或管理员尚未登录')
    }
    const user = await getUserDetail(fastify, userId || '')
    const admin = await getRootById(fastify, adminId || '')
    if (isNil(user) && isNil(admin)) {
        create401Response(res, '用户或管理员不存在')
    } else if (user?.isBanned === true) {
        create500Response(res, '用户已被封禁')
    } else {
        fastify.log.info({ userId, adminId })
    }
}
const create401Response = (res: FastifyReply, msg: string) => {
    res.statusCode = 401
    res.send({ code: 401, data: null, message: msg ?? '未登录' })
    throw new Error(msg || '未登录')
}
const create500Response = (res: FastifyReply, msg: string) => {
    res.statusCode = 500
    res.send({ code: 500, data: null, message: msg ?? '未登录' })
    throw new Error(msg || '未登录')
}