import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";
import {usersRepository} from "../repositories/users-repository";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req, res) => {
   await blogsRepository.deleteAllBlogs()
   await postsRepository.deleteAllPosts()
    await usersRepository.deleteAllUsers()
    return res.sendStatus(204)
})