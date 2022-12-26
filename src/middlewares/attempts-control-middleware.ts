import {NextFunction, Request, Response} from "express";
import {attemptsRepository} from "../repositories/attempts-repository";


export const ç = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const url = req.url
    const currentTime = new Date().toISOString()
    await attemptsRepository.addAttempt(ip, url, currentTime)
    const attemptsTime = new Date(+new Date(currentTime) - 10 * 1000).toISOString()
    const attemptsCount = await attemptsRepository.getLastAttempts(ip, url, attemptsTime)
    console.log(attemptsCount)
    if (attemptsCount > 5) {
        return res.sendStatus(429)
    }
    next()
}