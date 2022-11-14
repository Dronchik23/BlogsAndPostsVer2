import {EmailConfirmationType} from "../types/types";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";


export const authService = {
    async checkCredentials(loginOrEmail: string, password: string): Promise<any> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null

        if (!user.emailConfirmation.isConfirmed) {
            return null
        }

        const isHashIsEquals = await this._isPasswordCorrect(password, user.accountData.passwordHash)
        if (isHashIsEquals) {
            return user
        } else {
            return null
        }
    },
    // async _generateHash(password: string, salt: string) {
    //     const hash = await bcrypt.hash(password, salt)
    //     return hash
    // },
    async _isPasswordCorrect(password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    },
    async confirmEmail(code: string, email: string): Promise<boolean> {
        let user = await usersRepository.findByLoginOrEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        let result = await usersRepository.updateConfirmation(user.id)
        return result
    },
    async resendConfirmationCode(email: string): Promise<EmailConfirmationType | boolean | string > {
        const user = await usersRepository.findByLoginOrEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        return user.emailConfirmation.confirmationCode
    }
}