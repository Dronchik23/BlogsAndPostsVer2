import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {usersRepository} from "../repositories/users-repository";


export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.login, req.body.password)
        if (user) {
            //const token = await jwtService.createJWT(user)
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    })

// authRouter.post('/login',
//     async (req: Request, res: Response) => {
//         const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
//         if (user) {
//             const token = await jwtService.createJWT(user)
//             console.log(token)
//             res.status(201).send(user)
//         } else {
//             res.sendStatus(401)
//         }
//     })
