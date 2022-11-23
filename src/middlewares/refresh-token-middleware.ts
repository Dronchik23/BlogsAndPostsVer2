import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies, ' coo')
    const refreshToken = req.cookies.refreshToken
    console.log(refreshToken, 'rt')
    if (!refreshToken) return res.sendStatus(401)
    const isBanned = await jwtService.findBannedToken(refreshToken)
    console.log(isBanned, 'ban')
    if (isBanned) return res.sendStatus(401)
    const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
    console.log(userId, 'ui')
    if (!userId) return res.sendStatus(401)
    const user = await usersService.getUserByUserId(userId)
    console.log(user, 'user')
    if (!user) return res.sendStatus(401)
    await jwtService.addRefreshToBlackList(refreshToken)
    req.user = user
    req.userId = userId
    return next()
}