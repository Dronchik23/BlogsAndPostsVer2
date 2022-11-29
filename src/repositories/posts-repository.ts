import {postsCollection} from "../db";
import {Filter} from "mongodb";
import {PostDBType} from "../types/types";
import {PostViewModel} from "../models/models";
import {injectable} from "inversify";


const fromPostDBTypePostViewModel = (post: PostDBType): PostViewModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

const fromPostDBTypeToPostViewModelWithPagination = (posts: PostDBType[]): PostViewModel[] => {
    return posts.map(post => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        })
    )
}

@injectable()
export class PostsRepository {
    
    async findAllPosts(pageSize: number, sortBy: any, sortDirection: any, pageNumber: any): Promise<PostViewModel[]> {
       const allPosts = await postsCollection
            .find({})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()

        return fromPostDBTypeToPostViewModelWithPagination(allPosts)
    }

    async findPostById(id: string): Promise<PostViewModel | null> {
        const post = await postsCollection.findOne({id})
        if (post) {
            return fromPostDBTypePostViewModel(post)
        } else {
            return null
        }
    }

    async createPost(postForSave: PostDBType): Promise<PostViewModel> {
        await postsCollection.insertOne(postForSave)
        return fromPostDBTypePostViewModel(postForSave);
    }

    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string)
        : Promise<PostViewModel | boolean> {

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

    async deletePostById(id: string): Promise<PostViewModel | boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }

    async findPostsByBlogId(blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string) {
        return await postsCollection.find({blogId: blogId}, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()
    }

    async getPostsCount(filter: Filter<PostDBType>) {
        return postsCollection.countDocuments(filter)
    }

    async deleteAllPosts() {
        return postsCollection.deleteMany({})
    }
}
