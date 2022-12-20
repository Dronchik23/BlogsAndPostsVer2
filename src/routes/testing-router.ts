import {Router} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";
import {container} from "../composition-root";
import {DevicesRepository} from "../repositories/devices-repository";

export const testingRouter = Router({})

const blogsRepository = container.resolve(BlogsRepository)
const postsRepository = container.resolve(PostsRepository)
const usersRepository = container.resolve(UsersRepository)
const devicesRepository = container.resolve(DevicesRepository)

testingRouter.delete('/all-data', async (req, res) => {
    await blogsRepository.deleteAllBlogs()
    await usersRepository.deleteAllUsers()
    await postsRepository.deleteAllPosts()
    await devicesRepository.deleteAllDevices()
    return res.sendStatus(204)
})