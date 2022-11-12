import {Request, Response, Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {
    bodyBlogIdValidation,
    contentValidation, contentValidationForComment,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/validations";
import {queryParamsMiddleware,} from "../middlewares/query-params-parsing-middleware";
import {postsService} from "../domain/posts-service";
import {commentsService} from "../domain/comments-service";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {
    ErrorType,
    PaginationType,
    PostType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types/types";
import {
    CommentCreateModel,
    CommentViewModel,
    PaginationInputQueryModel,
    PostCreateModel,
    PostUpdateModel,
    PostViewModel
} from "../models/models";

const createPostValidation = [titleValidation, shortDescriptionValidation, contentValidation, bodyBlogIdValidation,
    inputValidationMiddleware]

export const postsRouter = Router({})

postsRouter.get('/:id/comments', queryParamsMiddleware,
    async (req: RequestWithParamsAndBody<{id: string}, PaginationInputQueryModel>, res: Response<PaginationType>) => {

    const post = await postsService.findPostById(req.params.id)
    if (!post) {
        return res.sendStatus(404)
    }
    const pageNumber: any = req.query.pageNumber
    const pageSize: any = req.query.pageSize
    const sortBy: any = req.query.sortBy
    const sortDirection: any = req.query.sortDirection
    const comments = await commentsService.findCommentsByPostId(post.id, pageNumber, pageSize, sortBy, sortDirection)
    return res.send(comments)

})

postsRouter.post('/:id/comments', authJWTMiddleware, contentValidationForComment, inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{id: string},
        CommentCreateModel>, res: Response<CommentViewModel | ErrorType>) => {

    const postId = req.params.id
    const content = req.body.content
    const user = req.user!

    const post = await postsService.findPostById(postId)
    if (!post) {
        return res.sendStatus(404)
    }

    const newComment = await commentsService.createComment(postId, content, user )
    if (newComment) {
        return res.status(201).send(newComment)
    } else {
        return res.status(401).send({
            "errorsMessages": [
                {
                    "message": "string",
                    "field": "postId"
                }
            ]
        })
    }

})

postsRouter.get('/', queryParamsMiddleware,
    async (req: RequestWithQuery<PaginationInputQueryModel>, res: Response<PaginationType>) => {

    const pageNumber: any = req.query.pageNumber
    const pageSize: any = req.query.pageSize
    const sortBy: any = req.query.sortBy
    const sortDirection: any = req.query.sortDirection

    const allPosts = await postsService.findAllPosts(pageSize, sortBy, sortDirection, pageNumber)

    return res.send(allPosts)
})

postsRouter.post('/', basicAuthMiddleware, createPostValidation,
    async (req: RequestWithBody<PostCreateModel>, res: Response<PostViewModel | ErrorType>) => {

    const newPost = await postsService.createPost(
        req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName)

    if (newPost) {
        return res.status(201).send(newPost)
    } else {
        return res.status(401).send({
            "errorsMessages": [
                {
                    "message": "string",
                    "field": "blogId"
                }
            ]
        })
    }
})

postsRouter.get('/:id', async (req: RequestWithParams<{id: string}>, res: Response<PostViewModel>) => {

    const post = await postsService.findPostById(req.params.id)
    if (post) {
        res.send(post)
    } else {
        res.sendStatus(404)
        return
    }
})

postsRouter.put('/:id', basicAuthMiddleware, bodyBlogIdValidation, titleValidation, shortDescriptionValidation,
    contentValidation, inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{id: string}, PostUpdateModel>, res: Response<PostViewModel>) => {

    const isUpdated = await postsService.updatePostById(req.params.id, req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId)
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.delete('/:id', basicAuthMiddleware, async (req: RequestWithParams<{id: string}>, res: Response) => {
    const isDeleted = await postsService.deletePostById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else
        res.sendStatus(404)
})