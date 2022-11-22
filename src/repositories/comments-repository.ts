import {commentsCollection, postsCollection} from "../db";
import {CommentDBType} from "../types/types";
import {Filter} from "mongodb";
import {CommentViewModel, UserViewModel} from "../models/models";

const fromCommentDBTypeToCommentViewModel = (comment: CommentDBType): CommentViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userId,
        createdAt: comment.createdAt
    }
}

class CommentsRepository {
    async createComment(commentForSave: CommentDBType): Promise<CommentViewModel> {
        await commentsCollection.insertOne(commentForSave)
        return fromCommentDBTypeToCommentViewModel(commentForSave)
    }
    async findCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string): Promise<any> {

        return await commentsCollection
            .find({postId: postId}, {projection: {_id: 0, postId: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()


    }
    async updateComment(commentId: string, content: string, user: UserViewModel) {
        const result = await commentsCollection.updateOne({id: commentId, userId: user.id}, {
            $set: {
                content: content
            }
        })
        return result.modifiedCount === 1
    }
    async findCommentById(commentId: string) {
        return await commentsCollection.findOne({id: commentId}, {projection: {_id: 0, postId: 0}})
    }
    async getPostsCount(filter: Filter<CommentDBType>) {
        return await commentsCollection.countDocuments(filter)
    }
    async deleteCommentById(commentId: string, user: UserViewModel) {
        const result =  await commentsCollection.deleteOne({id: commentId, userId: user.id})
        return result.deletedCount === 1
    }
}

export const commentsRepository = new CommentsRepository()