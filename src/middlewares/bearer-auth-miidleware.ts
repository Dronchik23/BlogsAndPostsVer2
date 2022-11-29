import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {UsersService} from "../domain/users-service";
import {UsersRepository} from "../repositories/users-repository";
import {EmailService} from "../domain/email-service";


const usersService = new UsersService(new UsersRepository, new EmailService)

export const authJWTMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if(!auth) {
        res.sendStatus(401)
        return
    }
    const authType = auth.split(' ')[0]
    if (authType !== 'Bearer') return res.sendStatus(401)

    const token = auth.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersService.getUserByUserId(userId)
        return next()
    }
    return res.sendStatus(401)

}

