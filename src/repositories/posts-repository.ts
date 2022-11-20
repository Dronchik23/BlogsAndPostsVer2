import {postsCollection} from "../db";
import {Filter} from "mongodb";
import {PostType} from "../types/types";

export class PostsRepository {
    async findAllPosts(pageSize: number, sortBy: any, sortDirection: any, pageNumber: any): Promise<PostType[]> {
        return await postsCollection
            .find({}, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray();
    }
    async findPostById(id: string): Promise<PostType | null> {
        const post = await postsCollection.findOne({id: id}, {projection: {_id: 0}})
        return post
    }
    async createPost(newPost: PostType): Promise<PostType | null> {

        const {id, title, shortDescription, content, blogId, blogName, createdAt} = newPost
        const result = await postsCollection.insertOne({
            id,
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt
        })
        return newPost;
    }
    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string)
        : Promise<PostType | boolean> {

        const result = await postsCollection.updateOne({id: id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            }
        })
        return result.matchedCount === 1
    }
    async deletePostById(id: string): Promise<PostType | boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
    async findPostsByBlogId(blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string)
    {
        return await postsCollection.find({blogId: blogId}, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()
    }
    async getPostsCount(filter: Filter<PostType>) {
        return postsCollection.countDocuments(filter)
    }
    async deleteAllPosts() {
        return postsCollection.deleteMany({})
    }
}

export const postsRepository = new PostsRepository()
