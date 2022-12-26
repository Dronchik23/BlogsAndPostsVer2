import {attemptsCollection} from "../db";

export class AttemptsRepository {
    constructor() {}
    async addAttempt(ip: string, url: string, time: string) {
        return attemptsCollection.insertOne({
            ip,
            url,
            attemptsTime: time
        })
    }

    async removeOldAttempts() {
        let result = await attemptsCollection.deleteMany({})
        return result.deletedCount
    }

    async getLastAttempts(ip: string, url: string, attemptsTime: string) {
        return  attemptsCollection.countDocuments({
            ip,
            url,
            attemptsTime: {$gt: attemptsTime}
        })
    }
}

export const attemptsRepository = new AttemptsRepository()