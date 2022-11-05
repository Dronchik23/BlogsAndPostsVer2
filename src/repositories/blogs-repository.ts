import {blogsCollection} from "../db"
import {BlogType} from "./types";
import {Filter} from "mongodb";
import {BlogViewModel} from "../models/models";


const searchNameTermFilter = (searchNameTerm: string | undefined | null): Filter<BlogType> => {
    return {name: {$regex: searchNameTerm ? searchNameTerm : '', $options:'i'}}
}


export const blogsRepository = {
    async findAllBlogs(searchNameTerm: any, pageSize: number, sortBy: any, sortDirection: any, pageNumber: any): Promise<BlogViewModel[]> {
        const filter = searchNameTermFilter(searchNameTerm)
        const sortedBlogs = blogsCollection.find(filter, {projection: {_id: 0}}).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({[sortBy]: sortDirection === 'asc' ? 1 : -1}).toArray()
        return sortedBlogs
    },
    async findBlogById(id: any): Promise<BlogType | null> {
        let blog: BlogType | null = await blogsCollection.findOne({id: id}, {projection: {_id: 0}})
        return blog
    },
    async createBlog(newBlog: BlogType): Promise<BlogType> {
        const {id, name, youtubeUrl, createdAt} = newBlog
        await blogsCollection.insertOne({id, name, youtubeUrl, createdAt})
        return newBlog
    },
    async updateBlogById(id: string, name: string, youtubeUrl: string) {
        const result = await blogsCollection.updateMany({id: id}, {
            $set: {
                name: name,
                youtubeUrl: youtubeUrl
            }
        })
        return result.matchedCount === 1
    },
    async deleteBlogById(id: string) {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async getBlogsCount(searchNameTerm?: any) {
        const filter = searchNameTermFilter(searchNameTerm)
        return await blogsCollection.countDocuments(filter)
    },
    async deleteAllBlogs() {
        return blogsCollection.deleteMany({})
    }
}


