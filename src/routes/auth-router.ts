import {Router} from "express";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {
    codeValidation,
    emailValidation,
    isCodeAlreadyConfirmed,
    isEmailAlreadyConfirmed, isEmailExist,
    loginValidation, passwordValidation
} from "../middlewares/validations";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {refreshTokenMiddleware} from "../middlewares/refresh-token-middleware";
import {container} from "../composition-root";
import {AuthController} from "../controller/auth-controller";
import rateLimit from 'express-rate-limit'


const  ExpressBrute = require('express-brute')

const store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);

const limiter = rateLimit({
    windowMs: 10000, max: 5,
})

const authController = container.resolve(AuthController)

export const authRouter = Router({})


authRouter.post('/login',
    limiter,
    authController.login.bind(authController))

authRouter.post('/refresh-token', refreshTokenMiddleware, authController.refreshToken.bind(authController))

authRouter.post('/registration-confirmation', limiter, isCodeAlreadyConfirmed, codeValidation,
    inputValidationMiddleware, authController.registrationConfirmation.bind(authController))

authRouter.post('/registration', limiter, emailValidation, loginValidation, passwordValidation,
    inputValidationMiddleware, authController.registration.bind(authController))

authRouter.post('/registration-email-resending', limiter, emailValidation, isEmailExist, isEmailAlreadyConfirmed,
    inputValidationMiddleware, authController.registrationEmailResending.bind(authController))

authRouter.get('/me', authJWTMiddleware, authController.me.bind(authController))

authRouter.post('/logout', refreshTokenMiddleware, authController.logout.bind(authController))

