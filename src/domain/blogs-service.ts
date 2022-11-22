import {blogsRepository} from "../repositories/blogs-repository";
import {BlogDBType, PaginationType} from "../types/types";
import {ObjectId} from "mongodb";
import {BlogViewModel} from "../models/models";

class BlogsService {
    async findAllBlogs(searchNameTerm: any, pageSize: number, sortBy: string, sortDirection: string,
                       pageNumber: number): Promise<PaginationType> {
        const allBlogs = await blogsRepository.findAllBlogs(searchNameTerm, pageSize, sortBy, sortDirection, pageNumber)
        const totalCount = await blogsRepository.getBlogsCount(searchNameTerm)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: allBlogs
        }
    }
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return blogsRepository.findBlogByBlogId(id)
    }
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewModel> {
        const newBlog = new BlogDBType(
            new ObjectId,
            name,
            description,
            websiteUrl,
            new Date()
        )

        const createdBlog = await blogsRepository.createBlog(newBlog)
        return createdBlog
    }
    async updateBlogById(id: string, name: string, websiteUrl: string) {
        return await blogsRepository.updateBlogById(id, name, websiteUrl)
    }
    async deleteBlogByBlogId(id: string) {
        return await blogsRepository.deleteBlogByBlogId(id)
    }
}

export const blogsService = new BlogsService()


