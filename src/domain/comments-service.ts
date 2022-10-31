import {CommentType, PaginationType, PostType, UserType} from "../repositories/types";
import {postsRepository} from "../repositories/posts-repository";
import {commentsRepository} from "../repositories/comments-repository";


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
            createdAt: new Date()
        }
        const createdComment = await commentsRepository.createComment(newComment)
        return createdComment
    },
    async findCommentsByPostId(postId: string): Promise<any> {
        const foundPosts = await commentsRepository.findCommentsById(postId)
        return foundPosts
    },
    async updateComment(commentId: string, content: string): Promise<any> {
        return await commentsRepository.updateComment(commentId, content)

    },
    async findCommentById(commentId: string): Promise<any> {
        const foundComment = await commentsRepository.findCommentById(commentId)
        return foundComment
    }
}