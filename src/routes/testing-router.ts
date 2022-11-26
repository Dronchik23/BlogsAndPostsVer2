import {Router} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";

export const testingRouter = Router({})

const blogsRepository = new BlogsRepository()
const postsRepository = new PostsRepository()
const usersRepository = new UsersRepository()

testingRouter.delete('/all-data', async (req, res) => {
   await blogsRepository.deleteAllBlogs.bind(blogsRepository)
   await postsRepository.deleteAllPosts.bind(postsRepository)
    await usersRepository.deleteAllUsers.bind(usersRepository)
    return res.sendStatus(204)
})