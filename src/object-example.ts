import {ObjectId} from "mongodb";

export const blogFabric = (name: string, description: string, websiteUrl: string) => {
    const blog = {
        "id": (+(new Date())).toString(),
        "name": name,
        "description": description,
        "websiteUrl": websiteUrl,
        "createdAt": new Date(),
        async findAllBlogs() {},
        async findBlogById() {},
        async createBlog() {},
        async updateBlogById() {},
        async deleteBlogById() {}
    }
    return blog
}

export class Blog {

    id: ObjectId
    constructor(public name: string,
                public description: string,
                public websiteUrl: string) {
        this.id = new ObjectId()
    }
}