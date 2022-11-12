import {blogsRepository} from "../repositories/blogs-repository";
import {BlogType, PaginationType} from "../types/types";


export const blogsService = {
    async findAllBlogs(searchNameTerm: string, pageSize: number, sortBy: string, sortDirection: string, pageNumber: number): Promise<PaginationType> {
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
    },
    async findBlogById(id: string): Promise<BlogType | null> {
        return blogsRepository.findBlogById(id)
    },
    async createBlog(name: string, youtubeUrl: string): Promise<BlogType> {
        const newBlog = {
            "id": (+(new Date())).toString(),
            "name": name,
            "youtubeUrl": youtubeUrl,
            "createdAt": new Date()
        }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        return createdBlog
    },
    async updateBlogById(id: string, name: string, youtubeUrl: string) {
        return await blogsRepository.updateBlogById(id, name, youtubeUrl)
    },
    async deleteBlogById(id: string) {
        return await blogsRepository.deleteBlogById(id)
    },
}


