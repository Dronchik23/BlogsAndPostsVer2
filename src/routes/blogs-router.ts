import {Request, Response, Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {contentValidation, nameValidation, paramsBlogIdValidation, shortDescriptionValidation, titleValidation, youtubeUrlValidation} from "../middlewares/validations";
import {queryParamsMiddleware} from "../middlewares/query-params-parsing-middleware";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";
import {
    PaginationType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types/types";
import {BlogCreateModel, BlogUpdateModel, BlogViewModel, PaginationInputQueryModel} from "../models/models";




export const blogsRouter = Router({})


blogsRouter.get('/', queryParamsMiddleware,
    async (req: RequestWithQuery<PaginationInputQueryModel>, res: Response<PaginationType>) => {
    
    const {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = req.query

    const allBlogs = await blogsService.findAllBlogs(searchNameTerm, pageSize, sortBy, sortDirection, pageNumber)

    return res.send(allBlogs)
})

blogsRouter.post('/',
    basicAuthMiddleware, nameValidation, youtubeUrlValidation, inputValidationMiddleware, shortDescriptionValidation, async (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>) => {

    const newBlog = await blogsService.createBlog(req.body.name, req.body.youtubeUrl)
    return res.status(201).send(newBlog)

})

blogsRouter.get('/:blogId/posts', queryParamsMiddleware, async (req: RequestWithParamsAndBody<{blogId: string}, PaginationInputQueryModel>, res: Response) => {

    const {pageNumber, pageSize, sortBy, sortDirection} = req.query
    const blog = await blogsService.findBlogById(req.params.blogId)
    if (!blog) return res.sendStatus(404)
    const posts = await postsService.findPostsByBlogId(req.params.blogId, pageNumber, pageSize, sortBy, sortDirection)
    if (posts) {
        res.send(posts)
    } else {
        res.sendStatus(401)
        return;
    }

})

blogsRouter.post('/:blogId/posts', queryParamsMiddleware,
    basicAuthMiddleware, titleValidation, shortDescriptionValidation, contentValidation, paramsBlogIdValidation, inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{blogId: string}, {title: string, shortDescription: string, content: string, blogId: string, blogName: string}>, res: Response) => {

    const blog = await blogsService.findBlogById(req.params.blogId)
    if (!blog) return res.sendStatus(404)
    const newPost = await postsService.createPost(
        req.body.title, req.body.shortDescription, req.body.content, req.params.blogId, req.body.blogName)

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

blogsRouter.get('/:id', async (req: RequestWithParams<{id: string}>, res: Response<BlogViewModel>) => {

    const blog = await blogsService.findBlogById(req.params.id)
    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(404)
        return;
    }

})

blogsRouter.put('/:blogId', basicAuthMiddleware,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware, shortDescriptionValidation, paramsBlogIdValidation, async (req: RequestWithParamsAndBody<{blogId: string}, BlogUpdateModel>, res: Response) => {

    const isUpdated = await blogsService.updateBlogById(req.params.blogId, req.body.name, req.body.youtubeUrl)
        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

blogsRouter.delete('/:blogId', basicAuthMiddleware, async (req: RequestWithParams<{blogId: string}>, res: Response) => {

    const isDeleted = await blogsService.deleteBlogById(req.params.blogId)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})