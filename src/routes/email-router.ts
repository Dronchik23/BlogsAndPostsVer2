import {Router, Request, Response} from 'express'
import {EmailService} from "../domain/email-service";

export const emailRouter = Router({})

class EmailController {
    private emailService: EmailService

    constructor() {
        this.emailService = new EmailService
    }

    async sendEmail(req: Request, res: Response) {
        await this.emailService.sendEmail(req.body.email, req.body.subject, req.body.message)
        res.sendStatus(204)
    }
}

const emailController = new EmailController()

emailRouter.post('/send', emailController.sendEmail.bind(emailController))