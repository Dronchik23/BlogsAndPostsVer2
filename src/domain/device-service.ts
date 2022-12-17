
import {DeviceType, PaginationType} from "../types/types";
import {injectable} from "inversify";
import {DevicesRepository} from "../repositories/devices-repository";
import {JwtService} from "../application/jwt-service";
import {randomUUID} from "crypto";


@injectable()
export class DevicesService {
    constructor(protected devicesRepository: DevicesRepository,
                protected jwtService: JwtService) {
    }

    async createDevice(userId: string, ip: string, title: string) {

        const deviceId = randomUUID()
        const lastActiveDate = new Date().toISOString()

        const device = new DeviceType(
            deviceId,
            ip,
            lastActiveDate,
            title,
            userId
        )
        console.log(userId)
        await this.devicesRepository.saveNewDevice(device)
        return deviceId
    }

    async rewriteIssueAt(deviceId: string, data: string) {
        await this.devicesRepository.rewriteIssueAt(deviceId, data)
        return deviceId

    }

    async findAllDevices(): Promise<any> {
       return await this.devicesRepository.findAllDevices()
    }

    async deleteAllDevicesExcludeCurrent(userId: string, currentDevice: string) {
        return await this.devicesRepository.deleteAllDevicesExcludeCurrent(userId, currentDevice)
    }

    async deleteDeviceByDeviceId(deviceId: string) {
        return await this.devicesRepository.deleteDeviceByDeviceId(deviceId)
    }
}