import {PostsService} from "../domain/posts-service";
import {CommentsService} from "../domain/comments-service";
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
    PostCreateModel, PostUpdateModel,
    PostViewModel
} from "../models/models";
import {Response} from "express";
import {inject, injectable} from "inversify";

@injectable()
export class PostsController {

    constructor(@inject(PostsService) protected postsService: PostsService,
                @inject(CommentsService) protected commentsService: CommentsService) {}

    async getCommentByPostId(req: RequestWithParamsAndBody<{ id: string }, PaginationInputQueryModel>,
                             res: Response<PaginationType>) {
        const post = await this.postsService.findPostByPostId(req.params.id)
        if (!post) {
            return res.sendStatus(404)
        }
        const pageNumber: any = req.query.pageNumber
        const pageSize: any = req.query.pageSize
        const sortBy: any = req.query.sortBy
        const sortDirection: any = req.query.sortDirection
        const comments = await this.commentsService.findCommentsByPostId(post.id, pageNumber, pageSize, sortBy,
            sortDirection)
        return res.send(comments)

    }

    async createCommentByPostId(req: RequestWithParamsAndBody<{ id: string }, CommentCreateModel>,
                                res: Response<CommentViewModel | ErrorType>) {

        const postId = req.params.id
        const content = req.body.content
        const user = req.user!

        const post = await this.postsService.findPostByPostId(postId)
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
        const post = await this.postsService.findPostByPostId(req.params.id)
        if (post) {
            res.send(post)
        } else {
            res.sendStatus(404)
            return
        }
    }

    async updatePostByPostId(req: RequestWithParamsAndBody<{ id: string }, PostUpdateModel>,
                             res: Response<PostViewModel>) {
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