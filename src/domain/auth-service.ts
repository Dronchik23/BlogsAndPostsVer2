import "reflect-metadata";
import {EmailConfirmationType} from "../types/types";
import bcrypt from "bcrypt";
import {EmailService} from "./email-service";
import {randomUUID} from "crypto";
import {UsersRepository} from "../repositories/users-repository";
import {injectable} from "inversify";

@injectable()
export class AuthService {

    constructor(protected usersRepository: UsersRepository, protected emailService: EmailService) {
    }

    async checkCredentials(loginOrEmail: string, password: string): Promise<any> {
        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        console.log(user, 'user in service')
        if (!user) return null
        const isHashIsEquals = await this._isPasswordCorrect(password, user.accountData.passwordHash)
        if (isHashIsEquals) {
            return user
        } else {
            return null
        }
    }

    async _isPasswordCorrect(password: string, hash: string) {
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
}