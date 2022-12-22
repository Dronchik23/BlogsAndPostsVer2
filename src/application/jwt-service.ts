import jwt from 'jsonwebtoken'
import {settings} from "./settings"
import {tokensRepository} from "../repositories/tokens-repository";
import {injectable} from "inversify";


@injectable()
export class JwtService {
    constructor() {
    }

    createJWT(userId: string, deviceId: string) {
        const accessToken = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '20m'})
        const refreshToken = jwt.sign({userId, deviceId}, settings.JWT_REFRESH_SECRET, {expiresIn: '20m'})
        return {accessToken, refreshToken}
    }

    async getUserIdByToken(token: string) {
        try {
            const result = jwt.verify(token, settings.JWT_SECRET) as { userId: string }
            return result.userId
        } catch (error) {
            return null
        }
    }

    async getUserIdByRefreshToken(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET)
            console.log(result, 'res')
            return result.userId
        } catch (error) {
            return null
        }
    }

    async getPayloadByRefreshToken(refreshToken: string) {
        try {
            return jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET)
        } catch (error) {
            console.log('getPayloadByRefreshToken Error: '+error)
            return null
        }
    }



    async addRefreshToBlackList(refreshToken: string) {
        return tokensRepository.addRefreshToBlackList(refreshToken)
    }

    async findBannedToken(refreshToken: string) {
        return tokensRepository.findBannedToken(refreshToken)
    }

    getLastActiveDate(refreshToken: string): string {
        const payload: any = jwt.decode(refreshToken)
        return new Date(payload.iat * 1000).toISOString()
    }
}
