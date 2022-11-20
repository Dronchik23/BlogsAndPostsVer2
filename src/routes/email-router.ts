import {Router, Request, Response} from 'express'
import {emailService} from "../domain/email-service";

export const emailRouter = Router({})

class EmailController {
    async sendEmail(req: Request, res: Response) {
        await emailService.sendEmail(req.body.email, req.body.subject, req.body.message)
        res.sendStatus(204)
    }
}

const emailController = new EmailController()

emailRouter.post('/send', emailController.sendEmail)