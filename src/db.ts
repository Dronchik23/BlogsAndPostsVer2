import {MongoClient, ObjectId} from 'mongodb'
import {BlogType, CommentType, PostType, UserDBType} from "./types/types";

const mongoUri = "mongodb+srv://solikamsk:solikamsk@cluster0.uu9g6jj.mongodb.net/?retryWrites=true&w=majority"


const client = new MongoClient(mongoUri)
export const db = client.db("blogs&posts")
export const blogsCollection = db.collection<BlogType>("blogs")
export const postsCollection = db.collection<PostType>("posts")
export const usersCollection = db.collection<UserDBType>("users")
export const commentsCollection = db.collection<CommentType>("comments")


export async function runDb() {
    try {
        await client.connect();
        await client.db("blogs&posts").command({ping:1});
        console.log("Connected successfully to mongo server");
    } catch (e){
        console.log(e)
        await client.close();
    }
}
