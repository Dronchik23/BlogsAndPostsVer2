import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {authService} from "../domain/auth-service";
import {emailValidation} from "../middlewares/validations";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersRepository} from "../repositories/users-repository";



export const authRouter = Router({})

authRouter.post('/registration', emailValidation, inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const email = await usersRepository.findByLoginOrEmail(req.body.email)
        if (email) return res.sendStatus(400)
        const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        if (user) {
           return res.status(200).json(user)
        } else {
            return res.sendStatus(400)
        }
    })

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.login, req.body.password)
        if (user) {
            const accessToken = await jwtService.createJWT(user)
            return res.send({accessToken})
        } else {
            return res.sendStatus(401)
        }
    })

authRouter.post('/confirm-email',
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code, req.body.email)
        if (result) {
            return res.sendStatus(201)
        } else {
            return res.sendStatus(400)
        }
    })

authRouter.post('/resend-registration-code',
    async (req: Request, res: Response) => {
  const result = await authService.resendConfirmationCode(req.body.email)
        if (result) {
            return res.sendStatus(201)
        } else {
            return res.sendStatus(400)
        }
    })

authRouter.get('/me', authJWTMiddleware,  (req: Request, res: Response) => {
    const user = req.user!
    return res.send({
        login: user.login,
        email: user.email,
        userId: user.id
    })
})
