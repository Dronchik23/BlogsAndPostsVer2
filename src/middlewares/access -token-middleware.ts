import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";

export const accessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
    if (!userId) return res.sendStatus(401)
    const isBanned = await jwtService.findBannedToken(refreshToken)
    if (isBanned) return res.sendStatus(401)
    return next
}