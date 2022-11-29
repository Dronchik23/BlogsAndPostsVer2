import {Router} from "express";

import {queryParamsMiddleware} from "../middlewares/query-params-parsing-middleware";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/validations";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {container} from "../composition-root";
import {UsersController} from "../controller/users-controller";


const usersController = container.resolve(UsersController)

export const usersRouter = Router({})

usersRouter.get('/', queryParamsMiddleware, usersController.getAllUsers.bind(usersController))

usersRouter.get('/:id', usersController.getUserByUserId.bind(usersController))

usersRouter.post('/', queryParamsMiddleware, basicAuthMiddleware, loginValidation, passwordValidation,
    emailValidation, inputValidationMiddleware, usersController.createUser.bind(usersController))

usersRouter.delete('/:id', basicAuthMiddleware, queryParamsMiddleware, usersController.deleteUserByUserId.bind(usersController))
