import {emailAdapter} from "../adapters/email-adapter";

export const emailService = {
    async sendEmail(email: any, subject: string, message: string) {
        await emailAdapter.sendEmail('user.email', 'some subject', '<div>message</div>')
    },
    async sendEmailConfirmationMessage(user: any) {
        // save to repo
        // get user from repo
        await emailAdapter.sendEmail('user.email', 'password recovery', '<div>${user.confirmationCode}message</div>')
    }

}