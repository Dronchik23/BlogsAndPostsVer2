import {Response, Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {
    bodyBlogIdValidation,
    contentValidation, contentValidationForComment,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/validations";
import {queryParamsMiddleware,} from "../middlewares/query-params-parsing-middleware";
import {PostsService} from "../domain/posts-service";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {
    ErrorType,
    PaginationType,
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
import {CommentsService} from "../domain/comments-service";


const createPostValidation = [titleValidation, shortDescriptionValidation, contentValidation, bodyBlogIdValidation,
    inputValidationMiddleware]

export const postsRouter = Router({})

class PostsController {

    private postsService: PostsService
    private commentsService: CommentsService

    constructor() {
        this.postsService = new PostsService()
        this.commentsService = new CommentsService()
    }

    async getCommentByPostId(req: RequestWithParamsAndBody<{ id: string }, PaginationInputQueryModel>,
                             res: Response<PaginationType>) {
        const post = await this.postsService.findPostById(req.params.id)
        if (!post) {
            return res.sendStatus(404)
        }
        const pageNumber: any = req.query.pageNumber
        const pageSize: any = req.query.pageSize
        const sortBy: any = req.query.sortBy
        const sortDirection: any = req.query.sortDirection
        const comments = await this.commentsService.findCommentsByPostId(post.id, pageNumber, pageSize, sortBy, sortDirection)
        return res.send(comments)

    }

    async createCommentByPostId(req: RequestWithParamsAndBody<{ id: string }, CommentCreateModel>,
                                res: Response<CommentViewModel | ErrorType>) {

        const postId = req.params.id
        const content = req.body.content
        const user = req.user!

        const post = await this.postsService.findPostById(postId)
        if (!post) {
            return res.sendStatus(404)
        }

        const newComment = await this.commentsService.createComment(postId, content, user)
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

    }

    async getAllPosts(req: RequestWithQuery<PaginationInputQueryModel>, res: Response<PaginationType>) {

        const pageNumber: any = req.query.pageNumber
        const pageSize: any = req.query.pageSize
        const sortBy: any = req.query.sortBy
        const sortDirection: any = req.query.sortDirection

        const allPosts = await this.postsService.findAllPosts(pageSize, sortBy, sortDirection, pageNumber)

        return res.send(allPosts)
    }

    async createPost(req: RequestWithBody<PostCreateModel>, res: Response<PostViewModel | ErrorType>) {
        const newPost = await this.postsService.createPost(
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
    }

    async getPostByPostId(req: RequestWithParams<{ id: string }>, res: Response<PostViewModel>) {
        const post = await this.postsService.findPostById(req.params.id)
        if (post) {
            res.send(post)
        } else {
            res.sendStatus(404)
            return
        }
    }

    async updatePostByPostId(req: RequestWithParamsAndBody<{ id: string }, PostUpdateModel>, res: Response<PostViewModel>) {
        const isUpdated = await this.postsService.updatePostById(req.params.id, req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)
        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async deletePostByPostId(req: RequestWithParams<{ id: string }>, res: Response) {
        const isDeleted = await this.postsService.deletePostById(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else
            res.sendStatus(404)
    }

}


const postsController = new PostsController()


postsRouter.get('/:id/comments', queryParamsMiddleware, postsController.getCommentByPostId.bind(postsController))

postsRouter.post('/:id/comments', authJWTMiddleware, contentValidationForComment, inputValidationMiddleware,
    postsController.createCommentByPostId.bind(postsController))

postsRouter.get('/', queryParamsMiddleware, postsController.getAllPosts.bind(postsController))

postsRouter.post('/', basicAuthMiddleware, createPostValidation, postsController.createPost.bind(postsController))

postsRouter.get('/:id', postsController.getPostByPostId.bind(postsController))

postsRouter.put('/:id', basicAuthMiddleware, bodyBlogIdValidation, titleValidation, shortDescriptionValidation,
    contentValidation, inputValidationMiddleware, postsController.updatePostByPostId.bind(postsController))

postsRouter.delete('/:id', basicAuthMiddleware, postsController.deletePostByPostId.bind(postsController))