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


// const objects: any[] = []
//
// const postsRepository = new PostsRepository()
// objects.push(postsRepository)
// const blogsRepository = new BlogsRepository()
// objects.push(blogsRepository)
// const blogsService = new BlogsService(blogsRepository)
// objects.push(blogsService)
// const postsService = new PostsService(blogsService, postsRepository)
// objects.push(postsService)
// const commentsRepository = new CommentsRepository()
// objects.push(commentsRepository)
// const commentsService = new CommentsService(postsRepository, commentsRepository)
// objects.push(commentsService)
// const emailService = new EmailService()
// objects.push(emailService)
// const usersRepository = new UsersRepository()
// objects.push(usersRepository)
// export const usersService = new UsersService(usersRepository, emailService)
// objects.push(usersService)
// const authService = new AuthService(usersRepository, emailService)
// objects.push(authService)


export const container = new Container()
container.bind<BlogsController>(BlogsController).to(BlogsController)
container.bind<BlogsService>(BlogsService).to(BlogsService)
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository)

container.bind<PostsController>(PostsController).to(PostsController)
container.bind<PostsService>(PostsService).to(PostsService)
container.bind<PostsRepository>(PostsRepository).to(PostsRepository)

container.bind<UsersController>(UsersController).to(UsersController)
container.bind<UsersService>(UsersService).to(UsersService)
container.bind<UsersRepository>(UsersRepository).to(UsersRepository)

container.bind<CommentsController>(CommentsController).to(CommentsController)
container.bind<CommentsService>(CommentsService).to(CommentsService)
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository)

container.bind<AuthController>(AuthController).to(AuthController)
container.bind<AuthService>(AuthService).to(AuthService)

container.bind<EmailController>(EmailController).to(EmailController)
container.bind<EmailService>(EmailService).to(EmailService)








