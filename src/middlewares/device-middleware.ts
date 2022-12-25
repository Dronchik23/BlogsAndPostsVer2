import {NextFunction, Request, Response} from "express";
import {DevicesService} from "../domain/device-service";
import {DevicesRepository} from "../repositories/devices-repository";
import {JwtService} from "../application/jwt-service";

const devicesService = new DevicesService(new DevicesRepository, new JwtService)


export const deviceMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const {userId, iat} = req.jwtPayload!
    const device = await devicesService
        .findDeviceByDeviceIdAndDate(req.params.deviceId, new Date(iat * 1000).toISOString())
    if (!device) return res.sendStatus(404)
    if (device!.userId !== userId) return res.sendStatus(403)

    return next()

}