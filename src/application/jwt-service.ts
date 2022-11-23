import jwt from 'jsonwebtoken'
import {settings} from "./settings"
import {tokensRepository} from "../repositories/tokens-repository";


export const jwtService = {
    async createJWT(userId: string) {
        console.log(userId, 'createJwt')
        const accessToken = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '1000s'})
        const refreshToken = jwt.sign({userId}, settings.JWT_REFRESH_SECRET, {expiresIn: '2000s'})
        const token = {accessToken, refreshToken}
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result = jwt.verify(token, settings.JWT_SECRET) as {userId: string}
            return result.userId
        } catch (error) {
            return null
        }
    },
    async getUserIdByRefreshToken(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET)
            console.log(result, 'res')
            return result.userId
        } catch (error) {
            return null
        }
    },
    async addRefreshToBlackList (refreshToken: string){
        return  tokensRepository.addRefreshToBlackList(refreshToken)
    },
    async findBannedToken(refreshToken: string) {
        return  tokensRepository.findBannedToken(refreshToken)
    },
}

