import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";
import {injectable} from "inversify";

@injectable()
export class CommentsController {

    constructor(protected commentsService: CommentsService) {}

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