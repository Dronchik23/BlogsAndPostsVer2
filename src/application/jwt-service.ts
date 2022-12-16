import jwt from 'jsonwebtoken'
import {settings} from "./settings"
import {tokensRepository} from "../repositories/tokens-repository";
import {injectable} from "inversify";
import {DevicesService} from "../domain/device-service";
import {DevicesController} from "../controller/devices-controller";

@injectable()
export class JwtService {
    constructor() {
    }

    async createJWT(userId: string, deviceId: string) {
        const accessToken = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '10s'})
        const refreshToken = jwt.sign({userId, deviceId}, settings.JWT_REFRESH_SECRET, {expiresIn: '20s'})
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
            return null
        }
    }



    async addRefreshToBlackList(refreshToken: string) {
        return tokensRepository.addRefreshToBlackList(refreshToken)
    }

    async findBannedToken(refreshToken: string) {
        return tokensRepository.findBannedToken(refreshToken)
    }

    async getLastActiveDate(refreshToken: string) {
        try {
            const payload: any = jwt.decode(refreshToken)
            return payload.iat
        } catch (error) {
            return null
        }

    }
}


// export const jwtService = {
//     async createJWT(userId: string) {
//         console.log(userId, 'createJwt')
//         const accessToken = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '10s'})
//         const refreshToken = jwt.sign({userId}, settings.JWT_REFRESH_SECRET, {expiresIn: '20s'})
//         const device = await devicesService
//         const token = {accessToken, refreshToken}
//         return token
//     },
//     async getUserIdByToken(token: string) {
//         try {
//             const result = jwt.verify(token, settings.JWT_SECRET) as {userId: string}
//             return result.userId
//         } catch (error) {
//             return null
//         }
//     },
//     async getUserIdByRefreshToken(refreshToken: string) {
//         try {
//             const result: any = jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET)
//             console.log(result, 'res')
//             return result.userId
//         } catch (error) {
//             return null
//         }
//     },
//     async addRefreshToBlackList (refreshToken: string){
//         return  tokensRepository.addRefreshToBlackList(refreshToken)
//     },
//     async findBannedToken(refreshToken: string) {
//         return  tokensRepository.findBannedToken(refreshToken)
//     },
//     async getLastActiveDate(refreshToken: string) {
//         try {
//        const payload: any = jwt.decode(refreshToken)
//             return payload.iat
//         } catch (error) {
//             return null
//         }
//
//     }
// }
//
