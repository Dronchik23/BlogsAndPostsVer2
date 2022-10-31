import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";



export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.login, req.body.password)
        if (user) {
            const accessToken = await jwtService.createJWT(user)
            return res.send({accessToken})
        } else {
            return res.sendStatus(404)
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