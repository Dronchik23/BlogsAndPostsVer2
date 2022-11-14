import {emailAdapter} from "../adapters/email-adapter";
import {UserDBType} from "../types/types";

export const emailService = {
    async sendEmail(email: any, subject: string, message: string) {
        await emailAdapter.sendEmail(email, subject, message)
    },
    async sendEmailConfirmationMessage(user: UserDBType) {
        const code = user.emailConfirmation.confirmationCode
        await emailAdapter.sendEmail(user.accountData.email,
            'Confirm your email' , `<a href='http://localhost:2000/auth/registration/auth/confirm-email?code=${code}'>complete registration</a>`)
    }
}


  ///  <a href='${config.linkBase}/auth/confirm-email?code=${code}'>complete registration</a>