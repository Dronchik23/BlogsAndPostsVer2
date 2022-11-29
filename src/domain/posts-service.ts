import {PostsRepository} from "../repositories/posts-repository";
import {PaginationType, PostDBType} from "../types/types";
import {BlogViewModel, PostViewModel} from "../models/models";
import {ObjectId} from "mongodb";
import {BlogsService} from "./blogs-service";
import {injectable} from "inversify";

@injectable()
export class PostsService {

    constructor(protected blogsService: BlogsService, protected postsRepository: PostsRepository) {
    }

    async findAllPosts(pageSize: number, sortBy: string, sortDirection: string, pageNumber: number)
        : Promise<PaginationType> {
        const allPosts = await this.postsRepository.findAllPosts(pageSize, sortBy, sortDirection, pageNumber)
        const totalCount = await this.postsRepository.getPostsCount({})
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: allPosts
        }
    }

    async findPostByPostId(id: string): Promise<PostViewModel | null> {
        return this.postsRepository.findPostById(id)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string)
        : Promise<PostViewModel | null> {
        const blog: BlogViewModel | null = await this.blogsService.findBlogById(blogId)
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
        const createdPost = await this.postsRepository.createPost(newPost)
        return createdPost

    }

    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string)
        : Promise<PostViewModel | boolean> {

        return await this.postsRepository.updatePostById(id, title, shortDescription, content, blogId)
    }

    async deletePostById(id: string): Promise<PostViewModel | boolean> {
        return await this.postsRepository.deletePostById(id)
    }

    async findPostsByBlogId(blogId: string, pageNumber: any, pageSize: any, sortBy: any, sortDirection: any) {

        const foundPostsById = await this.postsRepository.findPostsByBlogId(blogId, pageNumber, pageSize, sortBy,
            sortDirection)
        const totalCount = await this.postsRepository.getPostsCount({blogId: blogId})
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: foundPostsById
        }
    }
}
