import {inject, injectable} from "inversify";
import {DevicesService} from "../domain/device-service";
import {Request, Response} from "express";



@injectable()
export class DevicesController {

    constructor(@inject(DevicesService) protected devicesService: DevicesService) {
    }

    async createDevice(req: Request, res: Response) {
        const ip = req.ip
        const title = req.headers["user-agent"]
        const refreshToken = req.cookies.refreshToken
        await this.devicesService.createDevice(ip, title!, refreshToken)
        return res.status(201)
    }

    async getAllDevices(req: Request, res: Response) {
        const allDevices = await this.devicesService.findAllDevices()
        return res.send(allDevices)
    }

    async deleteAllDevicesExcludeCurrent(req: Request, res: Response) {
        const currentDevice = req.deviceId!
        const userId = req.userId!
        const isDeleted = await this.devicesService.deleteAllDevicesExcludeCurrent(userId, currentDevice)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteDeviceByDeviceId(req: Request, res: Response) {
        const isDeleted = await this.devicesService.deleteDeviceByDeviceId(req.params.deviceId)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}