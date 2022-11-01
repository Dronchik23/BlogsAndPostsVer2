import {ObjectId} from "mongodb";

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
    login: string
    email: string
    passwordHash: string
    passwordSalt: string
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
    items: BlogType[] | PostType[] | UserType[] | UserDBType[]
}
export type PaginationType2<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T
}


declare global {
    namespace Express {
        export interface Request {
            user: UserType | null
        }
    }
}