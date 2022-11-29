import {AuthService} from "../domain/auth-service";
import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {TokenType} from "../types/types";
import {jwtService} from "../application/jwt-service";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {

    constructor(@inject(AuthService) protected authService: AuthService,
                @inject(UsersService) protected usersService: UsersService) {
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
        const email = await this.usersService.findUserByLoginOrEmail(req.body.email)
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