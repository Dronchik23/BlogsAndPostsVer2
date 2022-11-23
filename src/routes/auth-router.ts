import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {authService} from "../domain/auth-service";
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

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token: TokenType = await jwtService.createJWT(user.id)
            res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true, expires: new Date(Date.now() + 20000)})
            return res.send({accessToken: token.accessToken})
        } else {
            return res.sendStatus(401)
        }
    })

authRouter.post('/refresh-token',
    async (req: Request, res: Response) => {
        const userId = req.userId!
        const token: TokenType = await jwtService.createJWT(userId)
        console.log(token)
        return res
            .status(200)
            .cookie('refreshToken', token.refreshToken,{httpOnly: true, secure: true, expires: new Date(Date.now() + 20000)})
            .send({accessToken: token.accessToken})

    })

authRouter.post('/registration-confirmation', isCodeAlreadyConfirmed, codeValidation, inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(400)
        }
    })

authRouter.post('/registration', emailValidation, loginValidation, passwordValidation, inputValidationMiddleware,
    async (req: Request, res: Response) => {
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
        const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        if (user) {
            return res.status(204).send(user)
        } else {
            return res.sendStatus(400)
        }
    })

authRouter.post('/registration-email-resending', emailValidation, isEmailExist, isEmailAlreadyConfirmed,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.resendConfirmationCode(req.body.email)
        if (result) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(400)
        }
    })

authRouter.get('/me', authJWTMiddleware, (req: Request, res: Response) => {
    const user = req.user!
    return res.send({
        login: user.login,
        email: user.email,
        userId: user.id
    })
})

authRouter.post('/logout', refreshTokenMiddleware,
    async (req: Request, res: Response) => {
        return res.sendStatus(204)
    })