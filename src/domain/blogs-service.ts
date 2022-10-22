import {blogsRepository} from "../repositories/blogs-repository";
import {BlogType, PaginationType} from "../repositories/types";


export const blogsService = {
    async findAllBlogs(searchNameTerm: any, pageSize: any, sortBy: any, sortDirection: any, pageNumber: any, filter: any): Promise<PaginationType> {
        const allBlogs = await blogsRepository.findAllBlogs(searchNameTerm, pageSize, sortBy, sortDirection, pageNumber)
        const totalCount = await blogsRepository.getBlogsCount({filter})
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
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


