import {Request, Response, Router} from "express";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {commentsService} from "../domain/comments-service";

export const commentsRouter = Router({})

commentsRouter.put('/:id', authJWTMiddleware, async (req: Request, res: Response) => {
    const isUpdated = await commentsService.updateComment(req.params.id, req.body.content)
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const comment = await commentsService.findCommentById(req.params.id)
    if(comment) {
        res.status(200).send(comment)
    } else {
        res.sendStatus(404)
    }
})

