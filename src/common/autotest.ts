import {blogsCollection, postsCollection} from "../db";

export async function removeAll() {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
}