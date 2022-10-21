import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";
import {BlogType, PaginationType, PostType} from "../repositories/types";

export const postsService = {
    async findAllPosts(pageSize: number, sortBy: string, sortDirection: string, pageNumber: number): Promise<PaginationType> {
        const allPosts = await postsRepository.findAllPosts(pageSize, sortBy, sortDirection, pageNumber)
        const totalCount = await postsRepository.getPostsCount({})

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: allPosts
        }
    },
    async findPostById(id: string): Promise<PostType | null> {
        return postsRepository.findPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string): Promise<PostType | null> {
        const blog: BlogType | null = await blogsRepository.findBlogById(blogId)
        if (!blog) {
            return null
        }
        const newPost = {
            "id": (+(new Date())).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": blog.name,
            "createdAt": new Date()
        }
        const createdPost = await postsRepository.createPost(newPost)
        return createdPost
    },
    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<PostType | boolean> {
        return await postsRepository.updatePostById(id, title, shortDescription, content, blogId)
    },
    async deletePostById(id: string): Promise<PostType | boolean> {
    return await postsRepository.deletePostById(id)
    },


    async findPostsByBlogId(blogId: string, pageNumber: any, pageSize: any, sortBy: any, sortDirection: any) {
        // это итемсы в объекте который в return
        const foundPostsById = await postsRepository.findPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection)
        // надо дописать для блогов
        const totalCount = await postsRepository.getPostsCount({blogId: blogId})
            // возврат можно вынести в функцию
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: foundPostsById
        }
    }
}