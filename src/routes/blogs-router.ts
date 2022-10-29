import {Request, Response, Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {contentValidation, nameValidation, paramsBlogIdValidation, shortDescriptionValidation, titleValidation, youtubeUrlValidation} from "../middlewares/validations";
import {queryParamsMiddleware} from "../middlewares/query-params-parsing-middleware";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";


export const blogsRouter = Router({})


blogsRouter.get('/', queryParamsMiddleware, async (req: Request, res: Response) => {

    const searchNameTerm: any = req.query.searchNameTerm
    const pageSize: any = req.query.pageSize
    const pageNumber: any = req.query.pageNumber
    const sortBy: any = req.query.sortBy
    const sortDirection: any = req.query.sortDirection

    const allBlogs = await blogsService.findAllBlogs(searchNameTerm, pageSize, sortBy, sortDirection, pageNumber)

    return res.send(allBlogs)
})

blogsRouter.post('/', basicAuthMiddleware, nameValidation, youtubeUrlValidation, inputValidationMiddleware, shortDescriptionValidation, async (req: Request, res: Response) => {

    const newBlog = await blogsService.createBlog(req.body.name, req.body.youtubeUrl)
    return res.status(201).send(newBlog)

})

blogsRouter.get('/:blogId/posts', queryParamsMiddleware, async (req: Request, res: Response) => {

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

blogsRouter.post('/:blogId/posts', queryParamsMiddleware, basicAuthMiddleware, titleValidation, shortDescriptionValidation, contentValidation, paramsBlogIdValidation, inputValidationMiddleware,  async (req: Request, res: Response) => {
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

blogsRouter.get('/:id', async (req: Request, res: Response) => {

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
    inputValidationMiddleware, shortDescriptionValidation, paramsBlogIdValidation, async (req: Request, res: Response) => {

    const isUpdated = await blogsService.updateBlogById(req.params.blogId, req.body.name, req.body.youtubeUrl)
        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

blogsRouter.delete('/:blogId', basicAuthMiddleware, async (req: Request, res: Response) => {

    const isDeleted = await blogsService.deleteBlogById(req.params.blogId)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})