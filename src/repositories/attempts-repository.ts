import {attemptsCollection} from "../db";

export class AttemptsRepository {
    constructor() {}
    async addAttempt(ip: string, url: string, time: Date) {
        let result = await attemptsCollection.insertOne({
            ip,
            url,
            time
        })
        return result.insertedId
    }

    async removeOldAttempts() {
        let result = await attemptsCollection.deleteMany({})
        return result.deletedCount
    }

    async getLastAttempts(ip: string, url: string, attemptsTime: Date) {
        const result = await attemptsCollection.countDocuments({
            ip,
            url,
            time: {$gt: attemptsTime}
        })
        return result
    }

}