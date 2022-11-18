import {ObjectId} from "mongodb"
import {Request} from "express"
import {BlogViewModel, CommentViewModel, PostViewModel, UserViewModel} from "../models/models";


export type CommentType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: Date
    postId: string
}
export type BlogType = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: Date
}
export type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    userId?: string
}
export type UserDBType = {
    _id: ObjectId
    id: string
    accountData: accountData
    emailConfirmation: EmailConfirmationType
    passwordSalt?: string
    passwordHash?: string
}
export type accountData = {
    userName: string
    email: string
    passwordHash: string
    createdAt: Date
}
export type UserType = {
    id: string
    login: string
    email: string
    createdAt: Date
}
export type PaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModel[] | PostViewModel[] | UserViewModel[] | CommentViewModel
}
export type ErrorType = {
    errorsMessages: [{message: string, field: string}]
}
export type EmailConfirmationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
}
export type TokenType = {
    accessToken: string
    refreshToken: string
}

export type TokenBlackListType = {
    refreshToken: string
}

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

declare global {
    namespace Express {
        export interface Request {
            user: UserType | null
        }
    }
}