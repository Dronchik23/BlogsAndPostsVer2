import {Request, Response, Router} from "express";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {CommentsService} from "../domain/comments-service";
import {contentValidationForComment} from "../middlewares/validations";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const commentsRouter = Router({})

class CommentsController {
    private commentsService: CommentsService

    constructor() {
        this.commentsService = new CommentsService()
    }

    async updateCommentByUserId(req: Request, res: Response) {
        const user = req.user!
        const comment = await this.commentsService.findCommentByCommentId(req.params.id)
        if (!comment) {
            return res.sendStatus(404)
        }
        const isUpdated = await this.commentsService.updateCommentByUserId(req.params.id, req.body.content, user)
        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(403)
        }
    }

    async getCommentByCommentId(req: Request, res: Response) {
        const comment = await this.commentsService.findCommentByCommentId(req.params.id)
        if (comment) {
            return res.status(200).send(comment)
        } else {
            return res.sendStatus(404)
        }
    }

    async deleteCommentByCommentId(req: Request, res: Response) {
        const user = req.user!
        const commentId = req.params.id
        const comment = await this.commentsService.findCommentByCommentId(commentId)
        if (!comment) {
            return res.sendStatus(404)
        }
        const isDeleted = await this.commentsService.deleteCommentByCommentId(req.params.id, user)
        if (isDeleted) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(403)
        }
    }
}

const commentsController = new CommentsController()

commentsRouter.put('/:id', contentValidationForComment, authJWTMiddleware, inputValidationMiddleware,
    commentsController.updateCommentByUserId.bind(commentsController))

commentsRouter.get('/:id', commentsController.getCommentByCommentId.bind(commentsController))

commentsRouter.delete('/:id', authJWTMiddleware, commentsController.deleteCommentByCommentId.bind(commentsController))

