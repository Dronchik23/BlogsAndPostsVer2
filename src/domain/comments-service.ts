import {CommentDBType} from "../types/types";
import {PostsRepository} from "../repositories/posts-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {ObjectId} from "mongodb";
import {CommentViewModel, PostViewModel, UserViewModel} from "../models/models";
import {injectable} from "inversify";

@injectable()
export class CommentsService {

    constructor(protected postsRepository: PostsRepository, protected commentsRepository: CommentsRepository) {}

    async createComment(postId: string, content: string, user: UserViewModel): Promise<CommentViewModel | null> {
        const post: PostViewModel | null = await this.postsRepository.findPostById(postId)
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
        const createdComment =  await this.commentsRepository.createComment(newComment)
        return createdComment

    }
    async findCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string,
                               sortDirection: string): Promise<any> {

        const foundComments = await this.commentsRepository.findCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection)
        const totalCount = await this.commentsRepository.getPostsCount({postId: postId})
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

        return await this.commentsRepository.updateComment(commentId, content, user)

    }
    async findCommentByCommentId(commentId: string): Promise<any> {

        const foundComment = await this.commentsRepository.findCommentById(commentId)
        return foundComment
    }
    async deleteCommentByCommentId(commentId: string, user: UserViewModel) {

        return await this.commentsRepository.deleteCommentById(commentId, user)
    }
}



