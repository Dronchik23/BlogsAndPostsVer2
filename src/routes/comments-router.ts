import {Router} from "express";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";
import {contentValidationForComment} from "../middlewares/validations";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {container} from "../composition-root";
import {CommentsController} from "../controller/comments-controller";


const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router({})

commentsRouter.put('/:id', contentValidationForComment, authJWTMiddleware, inputValidationMiddleware,
    commentsController.updateCommentByUserId.bind(commentsController))

commentsRouter.get('/:id', commentsController.getCommentByCommentId.bind(commentsController))

commentsRouter.delete('/:id', authJWTMiddleware, commentsController.deleteCommentByCommentId.bind(commentsController))

