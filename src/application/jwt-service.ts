import jwt from 'jsonwebtoken'
import {settings} from "./settings"
import {UserType} from "../repositories/types"


export const jwtService = {

    async createJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '10s'})
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}

