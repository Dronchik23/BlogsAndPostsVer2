import "reflect-metadata";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {PostsService} from "./domain/posts-service";
import {PostsRepository} from "./repositories/posts-repository";
import {CommentsService} from "./domain/comments-service";
import {UsersService} from "./domain/users-service";
import {EmailService} from "./domain/email-service";
import {UsersRepository} from "./repositories/users-repository";
import {CommentsRepository} from "./repositories/comments-repository";
import {AuthService} from "./domain/auth-service";
import {PostsController} from "./controller/posts-controller";
import {UsersController} from "./controller/users-controller";
import {CommentsController} from "./controller/comments-controller";
import {AuthController} from "./controller/auth-controller";
import {EmailController} from "./controller/email-controller";
import {BlogsController} from "./controller/blogs-controller";
import {Container} from "inversify";
import {DevicesController} from "./controller/devices-controller";
import {JwtService} from "./application/jwt-service";
import {DevicesService} from "./domain/device-service";
import {DevicesRepository} from "./repositories/devices-repository";


export const container = new Container()
container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepository).to(BlogsRepository)

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepository).to(PostsRepository)

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsRepository).to(CommentsRepository)

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)

container.bind(EmailController).to(EmailController)
container.bind(EmailService).to(EmailService)

container.bind(DevicesController).to(DevicesController)
container.bind(DevicesService).to(DevicesService)
container.bind(DevicesRepository).to(DevicesRepository)


container.bind(JwtService).to(JwtService)







