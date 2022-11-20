import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {queryParamsMiddleware} from "../middlewares/query-params-parsing-middleware";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/validations";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {PaginationType, RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {PaginationInputQueryModel, UserCreateModel, UserViewModel} from "../models/models";


export const usersRouter = Router({})

class UsersController {
    async getAllUsers(req: RequestWithQuery<PaginationInputQueryModel>, res: Response<PaginationType>) {

        const {searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection} = req.query

        const allUsers = await usersService.findAllUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize,
            sortBy, sortDirection)

        return res.send(allUsers)
    }

    async getUserByUserId(req: RequestWithParams<{ id: string }>, res: Response<UserViewModel>) {
        const user = await usersService.getUserByUserId(req.params.id)
        if (user) {
            return res.send(user)
        } else {
            res.sendStatus(404)
            return;
        }
    }

    async createUser(req: RequestWithBody<UserCreateModel>, res: Response<UserViewModel>) {
        const newUser = await usersService.createUser(req.body.loginOrEmail, req.body.email, req.body.password)
        res.status(201).send(newUser)
    }

    async deleteUserByUserId(req: RequestWithParams<{ id: string }>, res: Response) {
        const isDeleted = await usersService.deleteUserByUserId(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}

const usersController = new UsersController()

usersRouter.get('/', queryParamsMiddleware, usersController.getAllUsers)

usersRouter.get('/:id', usersController.getUserByUserId)

usersRouter.post('/', queryParamsMiddleware, basicAuthMiddleware, loginValidation, passwordValidation,
    emailValidation, inputValidationMiddleware, usersController.createUser)

usersRouter.delete('/:id', basicAuthMiddleware, queryParamsMiddleware, usersController.deleteUserByUserId)
