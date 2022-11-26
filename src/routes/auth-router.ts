import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {AuthService} from "../domain/auth-service";
import {
    codeValidation,
    emailValidation,
    isCodeAlreadyConfirmed,
    isEmailAlreadyConfirmed, isEmailExist,
    loginValidation, passwordValidation
} from "../middlewares/validations";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {TokenType} from "../types/types";
import {refreshTokenMiddleware} from "../middlewares/refresh-token-middleware";


export const authRouter = Router({})

class AuthController {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    async login(req: Request, res: Response) {
        const user = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token: TokenType = await jwtService.createJWT((user._id).toString())
            res.cookie('refreshToken', token.refreshToken, {
                httpOnly: true,
                secure: true,
            })
            return res.send({accessToken: token.accessToken})
        } else {
            return res.sendStatus(401)
        }
    }

    async refreshToken(req: Request, res: Response) {
        const userId = req.userId!
        const token: TokenType = await jwtService.createJWT(userId)
        return res
            .status(200)
            .cookie('refreshToken', token.refreshToken, {
                httpOnly: true,
                secure: true,
            })
            .send({accessToken: token.accessToken})
    }

    async registrationConfirmation(req: Request, res: Response) {
        const result = await this.authService.confirmEmail(req.body.code)
        if (result) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(400)
        }
    }

    async registration(req: Request, res: Response) {
        const email = await usersService.findUserByLoginOrEmail(req.body.email)
        if (email) {
            return res.status(400).send({
                "errorsMessages": [
                    {
                        "message": "E-mail already in use",
                        "field": "email"
                    }
                ]
            })
        }

    }

    async registrationEmailResending(req: Request, res: Response) {
        const result = await this.authService.resendConfirmationCode(req.body.email)
        if (result) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(400)
        }
    }

    async me(req: Request, res: Response) {
        const user = req.user!
        return res.send({
            login: user.login,
            email: user.email,
            userId: user.id
        })
    }

    async logout(req: Request, res: Response) {
        return res.sendStatus(204)
    }
}

const authController = new AuthController()

authRouter.post('/login',authController.login.bind(authController))

authRouter.post('/refresh-token', refreshTokenMiddleware, authController.refreshToken.bind(authController))

authRouter.post('/registration-confirmation', isCodeAlreadyConfirmed, codeValidation, inputValidationMiddleware, authController.registrationConfirmation.bind(authController))

authRouter.post('/registration', emailValidation, loginValidation, passwordValidation, inputValidationMiddleware, authController.registration.bind(authController))

authRouter.post('/registration-email-resending', emailValidation, isEmailExist, isEmailAlreadyConfirmed,
    inputValidationMiddleware, authController.registrationEmailResending.bind(authController))

authRouter.get('/me', authJWTMiddleware, authController.me.bind(authController))

authRouter.post('/logout', refreshTokenMiddleware, authController.logout.bind(authController))

