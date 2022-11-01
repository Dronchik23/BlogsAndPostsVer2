import {commentsCollection, postsCollection} from "../db";
import {CommentType, PostType} from "./types";
import {Filter} from "mongodb";

export const commentsRepository = {

    async createComment(newComment: any) {
        const {id, content, userId, userLogin, createdAt, postId} = newComment
        await commentsCollection.insertOne({
            id,
            content,
            userId,
            userLogin,
            createdAt,
            postId
        })
        return {
            id: id,
            content: content,
            userId: userId,
            userLogin: userLogin,
            createdAt: createdAt
        }
    },
    async findCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string): Promise<any> {

        const sortedComments = await commentsCollection
            .find({postId: postId}, {projection: {_id: 0, postId: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()
        return sortedComments
    },
    async updateComment(commentId: string, content: string) {
        const result = await commentsCollection.updateOne({commentId}, {
            $set: {
                content: content
            }
        })
        return result.matchedCount === 1
    },
    async findCommentById(commentId: string) {
        return await commentsCollection.findOne({id: commentId}, {projection: {_id: 0}})
    },
    async getPostsCount(filter: Filter<CommentType>) {
        return await commentsCollection.countDocuments(filter)
    }
}