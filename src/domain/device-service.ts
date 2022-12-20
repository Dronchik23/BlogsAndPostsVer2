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

    async createDevice(ip: string, title: string, lastActiveDate: string, deviceId: string, userId: string) {
        const device = new DeviceType(
            ip,
            title,
            lastActiveDate,
            deviceId,
            userId
        )
        return this.devicesRepository.saveNewDevice(device)
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

    async findAndDeleteDeviceByDeviceIdUserIdAndDate(deviceId: string, userId: string, lastActiveDate: string) {
        const device = await this.devicesRepository.findDeviceByDeviceIdUserIdAndDate(deviceId, userId, lastActiveDate)
        if (!device) return null
        return this.devicesRepository.findAndDeleteDeviceByDeviceIdUserIdAndDate(deviceId, userId, lastActiveDate)
    }

    async findDeviceByDeviceIdUserIdAndDate(deviceId: string, userId: string, lastActiveDate: string) {
        return this.devicesRepository.findDeviceByDeviceIdUserIdAndDate(deviceId, userId, lastActiveDate)
    }

    async updateLastActiveDateByDevice(deviceId: string, userId: string, newLastActiveDate: string) {
        return this.devicesRepository.updateLastActiveDateByDevice(deviceId, userId, newLastActiveDate)
    }
}