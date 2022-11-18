import {tokensBlackListCollection} from "../db";


export const tokensRepository = {
    async addRefreshToBlackList(refreshToken: string) {
        return tokensBlackListCollection.insertOne({refreshToken})
    },
    async findBannedToken(refreshToken: string) {
        return tokensBlackListCollection.findOne({refreshToken})
    }
}