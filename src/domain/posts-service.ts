import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";
import {PaginationType, PostDBType} from "../types/types";
import {BlogViewModel, PostViewModel} from "../models/models";
import {ObjectId} from "mongodb";

class PostsService {
    async findAllPosts(pageSize: number, sortBy: string, sortDirection: string, pageNumber: number)
        : Promise<PaginationType> {
        const allPosts = await postsRepository.findAllPosts(pageSize, sortBy, sortDirection, pageNumber)
        const totalCount = await postsRepository.getPostsCount({})
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: allPosts
        }
    }
    async findPostById(id: string): Promise<PostViewModel | null> {
        return postsRepository.findPostById(id)
    }
    async createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string)
        : Promise<PostViewModel | null> {
        const blog: BlogViewModel | null = await blogsRepository.findBlogByBlogId(blogId)
        if (!blog) {
            return null
        }
        const newPost = new PostDBType(
            new ObjectId,
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            new Date()
    )
        const createdPost = await postsRepository.createPost(newPost)
        return createdPost

    }
    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string)
        : Promise<PostViewModel | boolean> {

        return await postsRepository.updatePostById(id, title, shortDescription, content, blogId)
    }
    async deletePostById(id: string): Promise<PostViewModel | boolean> {
        return await postsRepository.deletePostById(id)
    }
    async findPostsByBlogId(blogId: string, pageNumber: any, pageSize: any, sortBy: any, sortDirection: any) {

        const foundPostsById = await postsRepository.findPostsByBlogId(blogId, pageNumber, pageSize, sortBy,
            sortDirection)
        const totalCount = await postsRepository.getPostsCount({blogId: blogId})
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: foundPostsById
        }
    }
}

export const postsService = new PostsService()
