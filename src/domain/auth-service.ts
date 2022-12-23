import {EmailConfirmationType, JWTPayloadType} from "../types/types";
import bcrypt from "bcrypt";
import {EmailService} from "./email-service";
import {randomUUID} from "crypto";
import {UsersRepository} from "../repositories/users-repository";
import {injectable} from "inversify";
import {JwtService} from "../application/jwt-service";
import {DevicesService} from "./device-service";


@injectable()
export class AuthService {
    constructor(
        protected usersRepository: UsersRepository,
        protected emailService: EmailService,
        protected jwtService: JwtService,
        protected devicesService: DevicesService
    ) {
    }

    async login (loginOrEmail: string, password: string, ip: string, title: string ) {
        const user = await this.checkCredentials(loginOrEmail, password)
        if (!user) return null
        const userId = (user._id).toString()
        const deviceId = randomUUID()
        //TODO Если девайс уже есть - обновить время в коллекции девайсов
        //TODO Если девайса такого нет то создаем...
        //TODO existsDeviceIdOrNull, перенести создание deviceId в device сервис. \/
        console.log('login userId:' + userId)
        console.log('login deviceId:' + deviceId)
        const {accessToken, refreshToken} = this.jwtService.createJWT(userId, deviceId)
        const lastActiveDate = this.jwtService.getLastActiveDate(refreshToken)
        await this.devicesService.createDevice(ip, title, lastActiveDate, deviceId, userId)
        return {accessToken, refreshToken}
    }

    private async checkCredentials(loginOrEmail: string, password: string): Promise<any> {
        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null
        const isHashIsEquals = await this.isPasswordCorrect(password, user.accountData.passwordHash)
        if (isHashIsEquals) {
            return user
        } else {
            return null
        }
    }

    private async isPasswordCorrect(password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    }

    async confirmEmail(code: string): Promise<boolean> {
        let user = await this.usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        let result = await this.usersRepository.updateConfirmation(user._id)
        return result
    }

    async resendConfirmationCode(email: string): Promise<EmailConfirmationType | boolean> {
        const user = await this.usersRepository.findByLoginOrEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        const newCode = randomUUID()
        await this.usersRepository.updateConfirmationCodeByUserId(user._id, newCode)
        await this.emailService.resendingEmailMessage(user.accountData.email, newCode)
        return true
    }

    async refreshToken(jwtPayload: JWTPayloadType) {
        const lastActiveDate = new Date(jwtPayload.iat * 1000).toISOString()
        const device = await this.devicesService
            .findDeviceByDeviceIdUserIdAndDate(jwtPayload.deviceId, jwtPayload.userId, lastActiveDate)
        if (!device) return null
        const {accessToken, refreshToken} = this.jwtService.createJWT(jwtPayload.userId, jwtPayload.deviceId)
        const newLastActiveDate = this.jwtService.getLastActiveDate(refreshToken)
        await this.devicesService
            .updateLastActiveDateByDevice(jwtPayload.deviceId, jwtPayload.userId, newLastActiveDate)
        return {accessToken, refreshToken}
    }
}