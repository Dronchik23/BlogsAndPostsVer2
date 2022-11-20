import {Request, Response, Router} from "express";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {commentsService} from "../domain/comments-service";
import {queryParamsMiddleware} from "../middlewares/query-params-parsing-middleware";
import {contentValidation, contentValidationForComment} from "../middlewares/validations";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

const commentsRouter = Router({})

class CommentsController {
    async updateCommentByUserId(req: Request, res: Response) {
        const user = req.user!
        const comment = await commentsService.findCommentByCommentId(req.params.id)
        if (!comment) {
            return res.sendStatus(404)
        }
        const isUpdated = await commentsService.updateCommentByUserId(req.params.id, req.body.content, user)
        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(403)
        }
    }

    async getCommentByCommentId(req: Request, res: Response) {
        const comment = await commentsService.findCommentByCommentId(req.params.id)
        if (comment) {
            return res.status(200).send(comment)
        } else {
            return res.sendStatus(404)
        }
    }

    async deleteCommentByCommentId(req: Request, res: Response) {
        const user = req.user!
        const commentId = req.params.id
        const comment = await commentsService.findCommentByCommentId(commentId)
        if (!comment) {
            return res.sendStatus(404)
        }
        const isDeleted = await commentsService.deleteCommentByCommentId(req.params.id, user)
        if (isDeleted) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(403)
        }
    }
}

const commentsController = new CommentsController()

commentsRouter.put('/:id', contentValidationForComment, authJWTMiddleware, inputValidationMiddleware,
    commentsController.updateCommentByUserId)

commentsRouter.get('/:id', commentsController.getCommentByCommentId)

commentsRouter.delete('/:id', authJWTMiddleware, commentsController.deleteCommentByCommentId)

