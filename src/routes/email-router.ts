import {Router} from 'express'
import {container} from "../composition-root";
import {EmailController} from "../controller/email-controller";


const emailController = container.resolve(EmailController)


export const emailRouter = Router({})

emailRouter.post('/send', emailController.sendEmail.bind(emailController))