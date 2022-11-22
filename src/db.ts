import {MongoClient} from 'mongodb'
import {
    BlogDBType,
    CommentDBType,
    PostDBType,
    TokenBlackListType,
    UserDBType
} from "./types/types";


const mongoUri = "mongodb+srv://solikamsk:solikamsk@cluster0.uu9g6jj.mongodb.net/?retryWrites=true&w=majority"


const client = new MongoClient(mongoUri)
export const db = client.db("blogs&posts")
export const blogsCollection = db.collection<BlogDBType>("blogs")
export const postsCollection = db.collection<PostDBType>("posts")
export const usersCollection = db.collection<UserDBType>("users")
export const commentsCollection = db.collection<CommentDBType>("comments")
export const tokensBlackListCollection = db.collection<TokenBlackListType>('tokensBlackList')


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
