import express from 'express'
import {runDb} from "./db"
import {blogsRouter} from "./routes/blogs-router"
import {postsRouter} from "./routes/posts-router"
import {usersRouter} from "./routes/users-router"
import {authRouter} from "./routes/auth-router"
import {testingRouter} from "./routes/testing-router"
import {commentsRouter} from "./routes/comments-router"
import {emailRouter} from "./routes/email-router"
import cookieParser from "cookie-parser"

export const app = express()

app.use(express.json())


const port = process.env.PORT || 2000

app.use(cookieParser())
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/testing', testingRouter)
app.use('/comments', commentsRouter)
app.use('/email', emailRouter)


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`postRouter`, postsRouter ),
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
