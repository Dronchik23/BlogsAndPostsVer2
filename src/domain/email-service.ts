import {emailManager} from "../manager/email-manager";

export const emailService = {
    async doOperation() {
        // save to repo
        // get user from repo
        await emailManager.sendPasswordRecoveryMessage({})
    }

}