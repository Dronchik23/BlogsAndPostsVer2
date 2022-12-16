import {Router} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";
import {container} from "../composition-root";

export const testingRouter = Router({})

const blogsRepository = container.resolve(BlogsRepository)
const postsRepository = new PostsRepository()
const usersRepository = container.resolve(UsersRepository)

testingRouter.delete('/all-data', async (req, res) => {
    await blogsRepository.deleteAllBlogs()
    await usersRepository.deleteAllUsers()
    return res.sendStatus(204)
})