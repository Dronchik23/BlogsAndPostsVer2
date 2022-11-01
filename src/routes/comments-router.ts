import {Request, Response, Router} from "express";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {commentsService} from "../domain/comments-service";
import {queryParamsMiddleware} from "../middlewares/query-params-parsing-middleware";
import {contentValidation} from "../middlewares/validations";

export const commentsRouter = Router({})

commentsRouter.put('/:id', contentValidation, authJWTMiddleware, async (req: Request, res: Response) => {
    const isUpdated = await commentsService.updateComment(req.params.id, req.body.content)
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(403)
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

commentsRouter.delete('/:id', async (req: Request, res: Response) => {
    const isDeleted = await commentsService.deleteCommentById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

