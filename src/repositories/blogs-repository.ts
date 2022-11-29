import "reflect-metadata";
import {blogsCollection} from "../db"
import {BlogDBType} from "../types/types";
import {Filter} from "mongodb";
import {BlogViewModel} from "../models/models";
import {injectable} from "inversify";


const searchNameTermFilter = (searchNameTerm: string | undefined | null): Filter<BlogDBType> => {
    return {name: {$regex: searchNameTerm ? searchNameTerm : '', $options: 'i'}}
}

const fromBlogDBTypeBlogViewModel = (blog: BlogDBType): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }
}

const fromBlogDBTypeBlogViewModelWithPagination = (blogs: BlogDBType[]): BlogViewModel[] => {
    return blogs.map(blog => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }))
}

@injectable()
export class BlogsRepository {

    async findAllBlogs(searchNameTerm: string, pageSize: number, sortBy: string, sortDirection: string,
                       pageNumber: number): Promise<BlogViewModel[]> {
        const filter = searchNameTermFilter(searchNameTerm)
        const sortedBlogs = await blogsCollection.find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()
        return fromBlogDBTypeBlogViewModelWithPagination(sortedBlogs)
    }

    async findBlogByBlogId(id: string): Promise<BlogViewModel | null> {
        let blog = await blogsCollection.findOne({id})
        if (blog) {
            return fromBlogDBTypeBlogViewModel(blog)
        } else {
            return null
        }
    }

    async createBlog(blogForSave: BlogDBType): Promise<BlogViewModel> {
        await blogsCollection.insertOne(blogForSave)
        return fromBlogDBTypeBlogViewModel(blogForSave)
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

    async deleteBlogByBlogId(id: string) {
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



