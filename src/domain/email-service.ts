import {emailAdapter} from "../adapters/email-adapter";

export const emailService = {
    async sendEmail(email: any, subject: string, message: string) {
        await emailAdapter.sendEmail(email, subject, message)
    },
    async sendEmailConfirmationMessage(user: any) {
        await emailAdapter.sendEmail(user.accountData.email, 'Confirm your email bitch' ,
            `http://localhost:2000/auth/registration/?code=${user.emailConfirmation.confirmationCode}`)
    }
}
