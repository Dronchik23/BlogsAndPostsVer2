import {NextFunction, Request, Response} from "express";
import {UsersService} from "../domain/users-service";
import {UsersRepository} from "../repositories/users-repository";
import {EmailService} from "../domain/email-service";
import {JwtService} from "../application/jwt-service";
import {container} from "../composition-root";
import {DevicesRepository} from "../repositories/devices-repository";

const usersService = new UsersService(new UsersRepository, new EmailService)
const jwtService = container.resolve(JwtService)
const deviceRepo = container.resolve(DevicesRepository)

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const payload: any = await jwtService.getPayloadByRefreshToken(refreshToken)
    if (!payload) return res.sendStatus(401)
    const userId = payload.userId
    const user = await usersService.getUserByUserId(userId)
    if (!user) return res.sendStatus(401)
    const deviceId = payload.deviceId
    const device = await deviceRepo.findOneByDeviceAndUserId(deviceId, userId)
    if (!device) return res.sendStatus(401)
    req.user = user
    req.userId = userId
    req.deviceId = deviceId
    return next()
}