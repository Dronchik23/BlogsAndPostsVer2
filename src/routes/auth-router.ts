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
import {attemptsControlMiddleware} from "../middlewares/attempts-control-middleware";


const authController = container.resolve(AuthController)

export const authRouter = Router({})


authRouter.post('/login',
    attemptsControlMiddleware,
    authController.login.bind(authController))

authRouter.post('/refresh-token', refreshTokenMiddleware, authController.refreshToken.bind(authController))

authRouter.post('/registration-confirmation', attemptsControlMiddleware, isCodeAlreadyConfirmed, codeValidation,
    inputValidationMiddleware, authController.registrationConfirmation.bind(authController))

authRouter.post('/registration', attemptsControlMiddleware, emailValidation, loginValidation, passwordValidation,
    inputValidationMiddleware, authController.registration.bind(authController))

authRouter.post('/registration-email-resending', attemptsControlMiddleware, emailValidation,
    inputValidationMiddleware, authController.registrationEmailResending.bind(authController))

authRouter.get('/me', authJWTMiddleware, authController.me.bind(authController))

authRouter.post('/logout', refreshTokenMiddleware, authController.logout.bind(authController))

