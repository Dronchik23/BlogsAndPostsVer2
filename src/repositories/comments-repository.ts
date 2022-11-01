import {commentsCollection, postsCollection} from "../db";
import {CommentType, PostType} from "./types";
import {Filter} from "mongodb";

export const commentsRepository = {

    async createComment(newComment: any) {
        // const {id, content, userId, userLogin, createdAt, postId} = newComment
        // await commentsCollection.insertOne({
        //     id,
        //     content,
        //     userId,
        //     userLogin,
        //     createdAt,
        //     postId
        // })
        await commentsCollection.insertOne({...newComment})
        // return {
        //     id: id,
        //     content: content,
        //     userId: userId,
        //     userLogin: userLogin,
        //     createdAt: createdAt
        // }
        return newComment
    },
    async findCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string): Promise<any> {

        return await commentsCollection
            .find({postId: postId}, {projection: {_id: 0, postId: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()


    },
    async updateComment(commentId: string, content: string) {
        const result = await commentsCollection.updateOne({id: commentId}, {
            $set: {
                content: content
            }
        })
        return result.matchedCount === 1
    },
    async findCommentById(commentId: string) {
        return await commentsCollection.findOne({id: commentId}, {projection: {_id: 0, postId: 0}})
    },
    async getPostsCount(filter: Filter<CommentType>) {
        return await commentsCollection.countDocuments(filter)
    },
    async deleteCommentById(commentId: string) {
        const result =  await commentsCollection.deleteOne({id: commentId})
        return result.deletedCount === 1
    }
}