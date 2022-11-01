import {CommentType, PaginationType, PostType, UserType} from "../repositories/types";
import {postsRepository} from "../repositories/posts-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {postsService} from "./posts-service";
import {blogsCollection} from "../db";
import {promises} from "dns";


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
        await commentsRepository.createComment(newComment)
        return {
            id: newComment.id,
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            createdAt: newComment.createdAt
        }
    },
    async findCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string): Promise<any> {

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
    async updateComment(commentId: string, content: string, user: UserType): Promise<any> {
        return await commentsRepository.updateComment(commentId, content, user)

    },
    async findCommentById(commentId: string): Promise<any> {
        const foundComment = await commentsRepository.findCommentById(commentId)
        return foundComment
    },
    async deleteCommentById(commentId: string) {
        return await commentsRepository.deleteCommentById(commentId)
    }
}

