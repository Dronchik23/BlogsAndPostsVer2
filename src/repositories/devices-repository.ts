import { devicesCollection} from "../db";
import { DeviceType} from "../types/types";
import {injectable} from "inversify";
import {Filter} from "mongodb";

const searchNameTermFilter = (searchNameTerm: string | undefined | null): Filter<DeviceType> => {
    return {name: {$regex: searchNameTerm ? searchNameTerm : '', $options: 'i'}}
}

@injectable()
export class DevicesRepository {

    async saveNewDevice(device: DeviceType) {
        return devicesCollection.insertOne(device)
    }

    async findOneByDeviceAndUserId(deviceId: string, userId: string) {
        return devicesCollection.findOne({deviceId, userId})
    }

    async rewriteIssueAt(deviceId: string, data: string) {
        return devicesCollection.updateOne({deviceId}, {$set: {lastActiveDate: data}})


    }

    async findAllDevices(): Promise<any> {
        return devicesCollection.find().toArray()

    }

    async getDevicesCount(searchNameTerm?: string) {
        const filter = searchNameTermFilter(searchNameTerm)
        return await devicesCollection.countDocuments(filter)
    }

    async deleteAllDevicesExcludeCurrent(userId: string, deviceId: string) {
        return devicesCollection.deleteMany({userId, deviceId})
    }

    async deleteDeviceByDeviceId(deviceId: string) {
        const result = await devicesCollection.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    }
}
