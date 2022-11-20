import {emailAdapter} from "../adapters/email-adapter";
import {UserDBType} from "../types/types";

export class EmailService {
    async sendEmail(email: any, subject: string, message: string) {
        await emailAdapter.sendEmail(email, subject, message)
    }
    async sendEmailRegistrationMessage(user: UserDBType) {
        const code = user.emailConfirmation.confirmationCode
        await emailAdapter.sendEmail(
            user.accountData.email, 'Confirm your email' ,
            `<a href='https://blogsandposts.herokuapp.com/auth/registration-confirmation?code=${code}'>complete registration</a>`
        )
    }
    async resendingEmailMessage(email: string, code: string) {
        await emailAdapter.sendEmail(
            email, 'Its yours new confirmation code' ,
            `<a href='https://blogsandposts.herokuapp.com/auth/registration-email-resending?code=${code}'>new confirmation code</a>`
        )
    }
}

export const emailService = new EmailService()



