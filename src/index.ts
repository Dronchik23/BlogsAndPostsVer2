import express, {Request, Response} from 'express'
import {runDb} from "./db"
import {blogsRouter} from "./routes/blogs-router"
import {postsRouter} from "./routes/posts-router"
import {removeAll} from "./common/autotest";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {testingRouter} from "./routes/testing-router";

const app = express()

app.use(express.json())


const port = process.env.PORT || 2000


app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/testing', testingRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
