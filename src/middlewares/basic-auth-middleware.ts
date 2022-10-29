import {NextFunction, Request, Response} from "express"

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) return res.sendStatus(401)

    const authMethod = auth.split(' ')[0]

    const authPayload = auth.split(' ')[1]

    if (authMethod !== 'Basic') return res.sendStatus(401)
    if (authPayload !== 'YWRtaW46cXdlcnR5') return res.sendStatus(401)

    return next()
}
