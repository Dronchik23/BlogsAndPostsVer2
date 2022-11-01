import {Request, Response, Router} from "express";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {commentsService} from "../domain/comments-service";
import {queryParamsMiddleware} from "../middlewares/query-params-parsing-middleware";
import {contentValidation} from "../middlewares/validations";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const commentsRouter = Router({})

commentsRouter.put('/:id', contentValidation, authJWTMiddleware, inputValidationMiddleware, async (req: Request, res: Response) => {
    const user = req.user!
    const isUpdated = await commentsService.updateComment(req.params.id, req.body.content, user)
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

