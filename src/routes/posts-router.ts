import {Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {
    bodyBlogIdValidation,
    contentValidation, contentValidationForComment,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/validations";
import {queryParamsMiddleware,} from "../middlewares/query-params-parsing-middleware";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {container} from "../composition-root";
import {PostsController} from "../controller/posts-controller";


const createPostValidation = [titleValidation, shortDescriptionValidation, contentValidation, bodyBlogIdValidation,
    inputValidationMiddleware]

const postsController = container.resolve(PostsController)

export const postsRouter = Router({})

postsRouter.get('/:id/comments', queryParamsMiddleware,
    postsController.getCommentByPostId.bind(postsController.getCommentByPostId))

postsRouter.post('/:id/comments', authJWTMiddleware,
    contentValidationForComment, inputValidationMiddleware,
    postsController.createCommentByPostId.bind(postsController))

postsRouter.get('/', queryParamsMiddleware, postsController.getAllPosts.bind(postsController))

postsRouter.post('/', basicAuthMiddleware, createPostValidation, postsController.createPost.bind(postsController))

postsRouter.get('/:id', postsController.getPostByPostId.bind(postsController))

postsRouter.put('/:id', basicAuthMiddleware, bodyBlogIdValidation, titleValidation, shortDescriptionValidation,
    contentValidation, inputValidationMiddleware, postsController.updatePostByPostId.bind(postsController))

postsRouter.delete('/:id', basicAuthMiddleware, postsController.deletePostByPostId.bind(postsController))