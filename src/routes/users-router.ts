import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {queryParamsMiddleware} from "../middlewares/query-params-parsing-middleware";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/validations";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";


export const usersRouter = Router({})

usersRouter.get('/', queryParamsMiddleware, async (req: Request, res: Response) => {

        const searchLoginTerm: any = req.query.searchLoginTerm
        const searchEmailTerm: any = req.query.searchEmailTerm
        const pageNumber: any = req.query.pageNumber
        const pageSize: any = req.query.pageSize
        const sortBy: any = req.query.sortBy
        const sortDirection: any = req.query.sortDirection

        const allUsers = await usersService.findAllUsers(searchLoginTerm, searchEmailTerm, pageSize, sortBy, sortDirection, pageNumber, null)
        return res.send(allUsers)
    })

usersRouter.post('/', queryParamsMiddleware, basicAuthMiddleware, loginValidation, passwordValidation, emailValidation, inputValidationMiddleware,  async (req: Request, res: Response) => {
        const newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        res.status(201).send(newUser)
    })

usersRouter.delete('/:id', basicAuthMiddleware,  queryParamsMiddleware, async (req: Request, res: Response) => {
        const isDeleted = await usersService.deleteUserById(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
