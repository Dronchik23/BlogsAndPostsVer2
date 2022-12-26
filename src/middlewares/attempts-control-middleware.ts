import {NextFunction, Request, Response} from "express";
import {attemptsRepository} from "../repositories/attempts-repository";


export const attemptsControlMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const attemptsInterval = 10 * 1000
    const ip = req.ip
    const url = req.url
    const currentTime = new Date()
    const attemptsTime = new Date(currentTime.getTime() - attemptsInterval)
    const attemptsCount = await attemptsRepository.getLastAttempts(ip, url, attemptsTime)
    await attemptsRepository.addAttempt(ip, url, currentTime)
    if (attemptsCount < 5) {
        next()
    } else {
        res.sendStatus(429)
    }
    return next()
}