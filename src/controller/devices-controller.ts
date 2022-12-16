import {inject, injectable} from "inversify";
import {DevicesService} from "../domain/device-service";
import {Request, Response} from "express";
import {PaginationType, RequestWithQuery} from "../types/types";
import {PaginationInputQueryModel} from "../models/models";

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

    async getAllDevices(req: RequestWithQuery<PaginationInputQueryModel>, res: Response<PaginationType>) {
        const {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = req.query
        const allDevices = await this.devicesService.findAllDevices(searchNameTerm, pageSize, sortBy, sortDirection, pageNumber)
        return res.send(allDevices)

    }
}