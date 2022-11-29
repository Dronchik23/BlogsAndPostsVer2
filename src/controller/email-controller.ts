import {EmailService} from "../domain/email-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";

@injectable()
export class EmailController {

    constructor(@inject(EmailService) protected emailService: EmailService) {}

    async sendEmail(req: Request, res: Response) {
        await this.emailService.sendEmail(req.body.email, req.body.subject, req.body.message)
        res.sendStatus(204)
    }
}