import {ObjectId} from "mongodb"
import {Request} from "express"
import {BlogViewModel, CommentViewModel, PostViewModel, UserViewModel} from "../models/models";
// types
export type PaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModel[] | PostViewModel[] | UserViewModel[] | CommentViewModel | DeviceType[]
}
export type ErrorType = {
    errorsMessages: [{ message: string, field: string }]
}
export type TokenType = {
    accessToken: string
    refreshToken: string
}
export type TokenBlackListType = {
    refreshToken: string
}
export type JWTPayloadType = {
    userId: string
    deviceId: string
    iat: number}
export type AttemptsType = {
    ip: string
    url: string
    attemptsTime: string
}


// classes
export class BlogDBType {
    constructor(public _id: ObjectId,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: Date
    ) {
    }
}

export class PostDBType {
    constructor(public _id: ObjectId,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: Date
    ) {
    }
}

export class UserDBType {
    constructor(public _id: ObjectId,
                public accountData: AccountDataType,
                public emailConfirmation: EmailConfirmationType,
                public passwordSalt?: string,
                public passwordHash?: string
    ) {
    }
}

export class CommentDBType {
    constructor(public _id: ObjectId,
                public content: string,
                public userId: string,
                public createdAt: Date,
                public postId: string
    ) {
    }
}

export class AccountDataType {
    constructor(public login: string,
                public email: string,
                public passwordHash: string,
                public createdAt: Date
    ) {
    }
}

export class EmailConfirmationType {
    constructor(public confirmationCode: string,
                public expirationDate: Date,
                public isConfirmed: boolean,
    ) {
    }
}

export class DeviceType {
    constructor(
                public ip: string,
                public title: string,
                public lastActiveDate: string,
                public deviceId: string,
                public userId: string
    ) {
    }

}

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>





declare global {
    namespace Express {
        export interface Request {
            user: UserViewModel | null
            userId: string | null
            deviceId: string | null
            jwtPayload: JWTPayloadType | null
        }
    }
}

