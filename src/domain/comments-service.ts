import {CommentType, PaginationType, PostType, UserType} from "../repositories/types";
import {postsRepository} from "../repositories/posts-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {postsService} from "./posts-service";
import {blogsCollection} from "../db";


export const commentsService = {
    async createComment(postId: string, content: string, user: UserType): Promise<any> {
        const post: PostType | null = await postsRepository.findPostById(postId)
        if (!post) {
            return null
        }
        const newComment = {
            id: (+(new Date())).toString(),
            content: content,
            userId: user.id,
            userLogin: user.login,
            createdAt: new Date(),
            postId: postId
        }
        const createdComment = await commentsRepository.createComment(newComment)
        return createdComment
    },
    async findCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string): Promise<any> {

        console.log(pageSize)
        const foundPosts = await commentsRepository.findCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection)
        const totalCount = await commentsRepository.getPostsCount({postId: postId})
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: foundPosts
        }
    },
    async updateComment(commentId: string, content: string): Promise<any> {
        return await commentsRepository.updateComment(commentId, content)

    },
    async findCommentById(commentId: string): Promise<any> {
        const foundComment = await commentsRepository.findCommentById(commentId)
        return foundComment
    }
}

