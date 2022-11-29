import {UsersService} from "../domain/users-service";
import {PaginationType, RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {PaginationInputQueryModel, UserCreateModel, UserViewModel} from "../models/models";
import {Response} from "express";
import {injectable} from "inversify";

@injectable()
export class UsersController {

    constructor(protected usersService: UsersService) {}

    async getAllUsers(req: RequestWithQuery<PaginationInputQueryModel>, res: Response<PaginationType>) {

        const {searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection} = req.query

        const allUsers = await this.usersService.findAllUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize,
            sortBy, sortDirection)

        return res.send(allUsers)
    }

    async getUserByUserId(req: RequestWithParams<{ id: string }>, res: Response<UserViewModel>) {
        const user = await this.usersService.getUserByUserId(req.params.id)
        if (user) {
            return res.send(user)
        } else {
            res.sendStatus(404)
            return;
        }
    }

    async createUser(req: RequestWithBody<UserCreateModel>, res: Response<UserViewModel>) {
        const newUser = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)
        res.status(201).send(newUser)
    }

    async deleteUserByUserId(req: RequestWithParams<{ userId: string }>, res: Response) {
        const isDeleted = await this.usersService.deleteUserByUserId(req.params.userId)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}