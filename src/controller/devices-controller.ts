import {inject, injectable} from "inversify";
import {DevicesService} from "../domain/device-service";
import {Request, Response} from "express";



@injectable()
export class DevicesController {

    constructor(@inject(DevicesService) protected devicesService: DevicesService,
    ) {}

    async getAllDevices(req: Request, res: Response) {
        const userId = req.user!.id
        const allDevices = await this.devicesService.findAllDevicesByUserId(userId)
        return res.send(allDevices)
    }

    async deleteAllDevicesExcludeCurrent(req: Request, res: Response) {
        const deviceId = req.jwtPayload!.deviceId!
        const userId = req.jwtPayload!.userId!
        const isDeleted = await this.devicesService.deleteAllDevicesExcludeCurrent(userId, deviceId)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteDeviceByDeviceId(req: Request, res: Response) {
        const userId = req.jwtPayload!
        const device = await this.devicesService
            .findDeviceByDeviceIdAndDate(req.params.deviceId)
        if (!device) return res.sendStatus(404)
        if (userId !== userId) return res.sendStatus(403)
        const isDeleted = await this.devicesService.deleteDeviceByDeviceId(req.params.deviceId)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(403)
        }
    }
}

// new Date(iat * 1000).toISOString()