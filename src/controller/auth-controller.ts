import {AuthService} from "../domain/auth-service";
import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {TokenType} from "../types/types";
import {inject, injectable} from "inversify";
import {JwtService} from "../application/jwt-service";
import {DevicesService} from "../domain/device-service";

@injectable()
export class AuthController {

    constructor(@inject(AuthService) protected authService: AuthService,
                @inject(UsersService) protected usersService: UsersService,
                @inject(JwtService) protected jwtService: JwtService,
                @inject(DevicesService) protected devicesService: DevicesService
    ) {
    }

    async login(req: Request, res: Response) {
        const ip = req.ip
        const title = req.headers["user-agent"]!
        const loginOrEmail = req.body.loginOrEmail
        const password = req.body.password
        console.log(  'auth controller => login => auth', req.headers.authorization)
        const tokens = await this.authService.login(loginOrEmail, password, ip, title)
        if (!tokens) return res.sendStatus(401)
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
        })
        return res.send({accessToken: tokens.accessToken})
    }

    async refreshToken(req: Request, res: Response) {
        const jwtPayload = req.jwtPayload!
        const tokens: TokenType | null = await this.authService.refreshToken(jwtPayload)
        if (!tokens) return res.sendStatus(401)
        return res
            .status(200)
            .cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
            })
            .send({accessToken: tokens.accessToken})
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
        const jwtPayload = req.jwtPayload!
        const lastActiveDate = new Date(jwtPayload.iat * 1000).toISOString()
        const device = await this.devicesService
            .findAndDeleteDeviceByDeviceIdUserIdAndDate(jwtPayload.deviceId, jwtPayload.userId, lastActiveDate)
        if (!device) {
            return res.sendStatus(401)
        }
        else  {
            return res.sendStatus(204)
        }

    }
}