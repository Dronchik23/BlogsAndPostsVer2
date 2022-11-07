import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendPasswordRecoveryMessage(user: any) {
        // save to repo
        // get user from repo
        await emailAdapter.sendEmail('user.email', 'password recovery', '<div>${user.recoveryCode}message</div>')
    }

}