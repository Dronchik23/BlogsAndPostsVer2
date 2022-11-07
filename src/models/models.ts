export type BlogCreateModel = {
    name: string
    youtubeUrl: string
}
export type BlogUpdateModel = {
    name: string
    youtubeUrl: string
}
export type BlogViewModel = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: Date
}

export type PaginationInputQueryModel = {
    searchLoginTerm?: string
    searchEmailTerm?: string
    searchNameTerm?: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}

export type PostCreateModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}
export type PostUpdateModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
}
export type UserCreateModel = {
    login: string
    email: string
    password: string
}
export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: Date
}
export type CommentCreateModel = {
    content: string
}

export type CommentViewModel = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: Date
}