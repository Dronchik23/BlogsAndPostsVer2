import {blogsCollection, devicesCollection} from "../db";
import {BlogDBType, DeviceType} from "../types/types";
import {injectable} from "inversify";
import {Filter} from "mongodb";

const searchNameTermFilter = (searchNameTerm: string | undefined | null): Filter<DeviceType> => {
    return {name: {$regex: searchNameTerm ? searchNameTerm : '', $options: 'i'}}
}

@injectable()
export class DevicesRepository {
    constructor() {
    }

    async saveNewDevice(device: DeviceType) {
        return devicesCollection.insertOne(device)
    }

    async findOneByDeviceAndUserId(deviceId: string, userId: string) {
        return devicesCollection.findOne({deviceId, userId})
    }

    async rewriteIssueAt(deviceId: string, data: string) {
        return devicesCollection.updateOne({deviceId}, {$set: {lastActiveDate: data}})


    }

    async findAllDevices(searchNameTerm: string, pageSize: number, sortBy: string, sortDirection: string,
                         pageNumber: number): Promise<DeviceType[]> {
        const filter = searchNameTermFilter(searchNameTerm)
        const sortedDevices = await devicesCollection.find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()
        return (sortedDevices)
    }

    async getDevicesCount(searchNameTerm?: string) {
        const filter = searchNameTermFilter(searchNameTerm)
        return await devicesCollection.countDocuments(filter)
    }
}
