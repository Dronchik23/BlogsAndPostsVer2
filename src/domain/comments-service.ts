import {CommentDBType} from "../types/types";
import {postsRepository} from "../repositories/posts-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {ObjectId} from "mongodb";
import {CommentViewModel, PostViewModel, UserViewModel} from "../models/models";

class CommentsService {
    async createComment(postId: string, content: string, user: UserViewModel): Promise<CommentViewModel | null> {
        const post: PostViewModel | null = await postsRepository.findPostById(postId)
        if (!post) {
            return null
        }
        const newComment = new CommentDBType(
            new ObjectId,
            content,
            user.login,
            user.createdAt,
            postId
        )
        const createdComment =  await commentsRepository.createComment(newComment)
        return createdComment

    }
    async findCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string,
                               sortDirection: string): Promise<any> {

        const foundComments = await commentsRepository.findCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection)
        const totalCount = await commentsRepository.getPostsCount({postId: postId})
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: foundComments
        }
    }
    async updateCommentByUserId(commentId: string, content: string, user: UserViewModel): Promise<any> {

        return await commentsRepository.updateComment(commentId, content, user)

    }
    async findCommentByCommentId(commentId: string): Promise<any> {

        const foundComment = await commentsRepository.findCommentById(commentId)
        return foundComment
    }
    async deleteCommentByCommentId(commentId: string, user: UserViewModel) {

        return await commentsRepository.deleteCommentById(commentId, user)
    }
}

export const commentsService = new CommentsService()



