import {emailAdapter} from "../adapters/email-adapter";

export const emailService = {
    async sendEmail(email: any, subject: string, message: string) {
        await emailAdapter.sendEmail(email, subject, message)
    },
    async sendEmailConfirmationMessage(user: any) {
        await emailAdapter.sendEmail(user.accountData.email, 'some subject', `<div>${user.confirmationCode}message</div>`)
    }
}
