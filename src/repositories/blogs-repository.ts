import {blogsCollection} from "../db"
import {BlogType} from "../types/types";
import {Filter} from "mongodb";
import {BlogViewModel} from "../models/models";

const searchNameTermFilter = (searchNameTerm: string | undefined | null): Filter<BlogType> => {
    return {name: {$regex: searchNameTerm ? searchNameTerm : '', $options:'i'}}
}

export class BlogsRepository {
    async findAllBlogs(searchNameTerm: string, pageSize: number, sortBy: string, sortDirection: string,
                       pageNumber: number): Promise<BlogViewModel[]> {
        const filter = searchNameTermFilter(searchNameTerm)
        const sortedBlogs = blogsCollection.find(filter, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()
        return sortedBlogs
    }
    async findBlogById(id: string): Promise<BlogType | null> {
        let blog: BlogType | null = await blogsCollection.findOne({id: id}, {projection: {_id: 0}})
        return blog
    }
    async createBlog(newBlog: BlogType): Promise<BlogType> {
        const {id, name, description, websiteUrl, createdAt} = newBlog
        await blogsCollection.insertOne({id, name, description, websiteUrl, createdAt})
        return newBlog
    }
    async updateBlogById(id: string, name: string, youtubeUrl: string) {
        const result = await blogsCollection.updateMany({id: id}, {
            $set: {
                name: name,
                youtubeUrl: youtubeUrl
            }
        })
        return result.matchedCount === 1
    }
    async deleteBlogById(id: string) {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
    async getBlogsCount(searchNameTerm?: string) {
        const filter = searchNameTermFilter(searchNameTerm)
        return await blogsCollection.countDocuments(filter)
    }
    async deleteAllBlogs() {
        return blogsCollection.deleteMany({})
    }
}

export const blogsRepository = new BlogsRepository()


