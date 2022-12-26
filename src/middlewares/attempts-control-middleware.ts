import {injectable} from "inversify";
import {AttemptsRepository} from "../repositories/attempts-repository";
import {NextFunction, Request, Response} from "express";


@injectable()
class AttemptsControlMiddleware {
    constructor(private attemptsRepository: AttemptsRepository) {
    }

    private attemptsInterval = 10 * 1000

    async checkAttempts(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip
        const url = req.url
        const currentTime = new Date()
        const attemptsTime = new Date(currentTime.getTime() - this.attemptsInterval)
        const attemptsCount = await this.attemptsRepository.getLastAttempts(ip, url, attemptsTime)
        await this.attemptsRepository.addAttempt(ip, url, currentTime)
        if (attemptsCount < 5) {
            next()
        } else {
            res.sendStatus(429)
        }
    }
}

export const attemptsControlMiddleware = new AttemptsControlMiddleware(new AttemptsRepository)