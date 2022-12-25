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

    async findAllDevicesByUserId(userId: string): Promise<any> {
        return devicesCollection.find({userId}, {projection: {_id: false, userId: false}}).toArray()

    }

    async getDevicesCount(searchNameTerm?: string) {
        const filter = searchNameTermFilter(searchNameTerm)
        return await devicesCollection.countDocuments(filter)
    }

    async deleteAllDevicesExcludeCurrent(userId: string, deviceId: any) {
        const result = await  devicesCollection.deleteMany({userId: userId, deviceId: {$ne: deviceId}})
        return result.acknowledged
    }

    async deleteDeviceByDeviceId(deviceId: string) {
        const result = await devicesCollection.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    }

    async findDeviceByDeviceIdUserIdAndDate(deviceId: string, userId: string, lastActiveDate: string) {
        return await devicesCollection.findOne({deviceId: deviceId, userId: userId, lastActiveDate: lastActiveDate})
    }

    async updateLastActiveDateByDevice(deviceId: string, userId: string, newLastActiveDate: string) {
        return await devicesCollection.updateOne({deviceId: deviceId, userId: userId}, {$set: {lastActiveDate: newLastActiveDate}})
    }

    async findAndDeleteDeviceByDeviceIdUserIdAndDate(deviceId: string, userId: string, lastActiveDate: string) {
       return  devicesCollection.deleteOne({deviceId: deviceId, userId: userId, lastActiveDate: lastActiveDate})
    }

    async deleteAllDevices() {
        await devicesCollection.deleteMany({})
    }

    async findDeviceByDeviceIdAndDate(deviceId: string, lastActiveDate: string) {
        return devicesCollection.findOne({deviceId, lastActiveDate})
    }
}
