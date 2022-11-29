import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../composition-root";


export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('usersService', usersService)
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const isBanned = await jwtService.findBannedToken(refreshToken)
    if (isBanned) return res.sendStatus(401)
    const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
    if (!userId) return res.sendStatus(401)
    const user = await usersService.getUserByUserId(userId)
    if (!user) return res.sendStatus(401)
    await jwtService.addRefreshToBlackList(refreshToken)
    req.user = user
    req.userId = userId
    return next()
}