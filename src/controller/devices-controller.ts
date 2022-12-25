import {inject, injectable} from "inversify";
import {DevicesService} from "../domain/device-service";
import {Request, Response} from "express";
import {usersRouter} from "../routes/users-router";



@injectable()
export class DevicesController {

    constructor(@inject(DevicesService) protected devicesService: DevicesService,
    ) {
    }

    // async createDevice(req: Request, res: Response) {
    //     const ip = req.ip
    //     const title = req.headers["user-agent"]
    //     const refreshToken = req.cookies.refreshToken
    //     await this.devicesService.createDevice(ip, title!, refreshToken)
    //     return res.status(201)
    // }

    async getAllDevices(req: Request, res: Response) {
        const userId = req.user!.id
        const allDevices = await this.devicesService.findAllDevicesByUserId(userId)
        return res.send(allDevices)
    }

    async deleteAllDevicesExcludeCurrent(req: Request, res: Response) {
        const deviceId = req.jwtPayload!.deviceId!
        console.log('deviceId: '+deviceId)
        const userId = req.jwtPayload!.userId!
        console.log('userId: '+userId)
        const isDeleted = await this.devicesService.deleteAllDevicesExcludeCurrent(userId, deviceId)
        console.log('isDeleted: '+isDeleted)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteDeviceByDeviceId(req: Request, res: Response) {
        const { iat} = req.jwtPayload!
        const device = await this.devicesService
            .findDeviceByDeviceIdAndDate(req.params.deviceId, new Date(iat*1000).toISOString())
        if (!device) return res.sendStatus(404)
        if (device!.userId !== req.userId) return res.sendStatus(403)

        const isDeleted = await this.devicesService.deleteDeviceByDeviceId(req.params.deviceId)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(403)
        }
    }
}