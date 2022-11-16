import {EmailConfirmationType} from "../types/types";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {emailService} from "./email-service";
import {randomUUID} from "crypto";


export const authService = {
    async checkCredentials(loginOrEmail: string, password: string): Promise<any> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        console.log(user)
        if (!user) return null

        // if (!user.emailConfirmation.isConfirmed) {
        //     return null
        // }

        const isHashIsEquals = await this._isPasswordCorrect(password, user.accountData.passwordHash)
        if (isHashIsEquals) {
            return user
        } else {
            return null
        }
    },
    async _isPasswordCorrect(password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    },
    async confirmEmail(code: string): Promise<boolean> {
        let user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        let result = await usersRepository.updateConfirmation(user.id)
        return result
    },
    async resendConfirmationCode(email: string): Promise<EmailConfirmationType | boolean > {
        const user = await usersRepository.findByLoginOrEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        const newCode = randomUUID()
        await usersRepository.updateConfirmationCodeByUserId(user.id, newCode)
        await emailService.resendingEmailMessage(user.accountData.email, newCode)
        return true
    }
}