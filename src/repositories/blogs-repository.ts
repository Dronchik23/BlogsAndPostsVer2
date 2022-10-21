import {blogsCollection} from "../db"
import {Filter} from "mongodb"
import {BlogType} from "./types";
import {NextFunction, Request, Response} from "express";
import {sortByFunction} from "../middlewares/query-params-parsing-middleware";



export const blogsRepository = {
    async findAllBlogs(searchNameTerm: any, pageSize: number, sortBy: any, sortDirection: any, pageNumber: any): Promise<BlogType[]> {
        const filter = {
            name: {$regex: searchNameTerm ? searchNameTerm : ''},
        }
        const sortedBlogs = blogsCollection.find(filter, {projection:{_id:0}}).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({[sortBy] : sortDirection === 'asc' ? 1 : -1}).toArray()
        return sortedBlogs
    },
    async findBlogById(id: any): Promise<BlogType  | null> {
        let blog: BlogType | null = await blogsCollection.findOne({id: id}, {projection:{_id:0}})
        return blog
    },
    async createBlog(newBlog: BlogType): Promise<BlogType> {
        const {id, name, youtubeUrl, createdAt} = newBlog
        const result = await blogsCollection.insertOne({id, name, youtubeUrl, createdAt})
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
    async getBlogsCount(filter: Filter<BlogType>){
        return blogsCollection.countDocuments(filter)
    },
    async deleteAllBlogs() {
        return blogsCollection.deleteMany({})
    }
}


