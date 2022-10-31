import {commentsCollection} from "../db";
import {CommentType} from "./types";

export const commentsRepository = {

    async createComment(newComment: any) {
        const {id, content, userId, userLogin, createdAt} = newComment
        await commentsCollection.insertOne({
            id,
            content,
            userId,
            userLogin,
            createdAt
        })
        return newComment;
    },
    async findCommentsById(postId: string) {
       const comments =  await commentsCollection.find({id: postId}, {projection: {_id: 0}})
        return comments
    },
    async updateComment(commentId: string, content: string) {
        const result =  await commentsCollection.updateOne({commentId}, {
            $set: {
                content: content
            }
        })
        return result.matchedCount === 1
    },
    async findCommentById(commentId: string) {
        return await commentsCollection.findOne({id: commentId}, {projection: {_id: 0}})
    }
}