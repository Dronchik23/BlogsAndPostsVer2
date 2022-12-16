
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
            ip,
            title,
            lastActiveDate,
            deviceId,
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

    async findAllDevices(searchNameTerm: any, pageSize: number, sortBy: string, sortDirection: string,
                         pageNumber: number): Promise<PaginationType> {
        const allDevices = await this.devicesRepository.findAllDevices(searchNameTerm, pageSize, sortBy, sortDirection, pageNumber)
        const totalCount = await this.devicesRepository.getDevicesCount(searchNameTerm)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: allDevices
        }
    }
}