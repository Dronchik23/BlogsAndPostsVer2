import {Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {
    contentValidation,
    nameValidation,
    paramsBlogIdValidation,
    shortDescriptionValidation,
    titleValidation,
    websiteUrlValidation
} from "../middlewares/validations";
import {queryParamsMiddleware} from "../middlewares/query-params-parsing-middleware";
import {BlogsController} from "../controller/blogs-controller";
import {container} from "../composition-root";



const blogsController = container.resolve(BlogsController)

export const blogsRouter = Router({})


blogsRouter.get('/', queryParamsMiddleware, blogsController.getAllBlogs.bind(blogsController))

blogsRouter.post('/',
    basicAuthMiddleware, nameValidation, websiteUrlValidation, inputValidationMiddleware, shortDescriptionValidation,
    blogsController.createBlog.bind(blogsController))

blogsRouter.get('/:blogId/posts', queryParamsMiddleware, blogsController.getPostByBlogId.bind(blogsController))

blogsRouter.post('/:blogId/posts', queryParamsMiddleware,
    basicAuthMiddleware, titleValidation, shortDescriptionValidation, contentValidation, paramsBlogIdValidation,
    inputValidationMiddleware, blogsController.createPostByBlogId.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))

blogsRouter.put('/:blogId', basicAuthMiddleware, nameValidation, websiteUrlValidation, inputValidationMiddleware,
    shortDescriptionValidation, paramsBlogIdValidation, blogsController.updateBlogById.bind(blogsController))

blogsRouter.delete('/:blogId', basicAuthMiddleware, blogsController.deleteBlogByBlogId.bind(blogsController))