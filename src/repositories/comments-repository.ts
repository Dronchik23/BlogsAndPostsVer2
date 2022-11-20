import {commentsCollection, postsCollection} from "../db";
import {CommentType, PostType, UserType} from "../types/types";
import {Filter} from "mongodb";

class CommentsRepository {
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
    }
    async findCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string): Promise<any> {

        return await commentsCollection
            .find({postId: postId}, {projection: {_id: 0, postId: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()


    }
    async updateComment(commentId: string, content: string, user: UserType) {
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
    async getPostsCount(filter: Filter<CommentType>) {
        return await commentsCollection.countDocuments(filter)
    }
    async deleteCommentById(commentId: string, user: UserType) {
        const result =  await commentsCollection.deleteOne({id: commentId, userId: user.id})
        return result.deletedCount === 1
    }
}

export const commentsRepository = new CommentsRepository()