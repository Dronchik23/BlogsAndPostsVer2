import {usersCollection} from "../db";
import {Filter, ObjectId} from "mongodb";
import {BlogType, UserDBType, UserType} from "./types";

type searchLoginOrEmailTermType = string | undefined | null

const searchLoginAndEmailTermFilter = (searchLoginTerm: searchLoginOrEmailTermType, searchEmailTerm: searchLoginOrEmailTermType): Filter<UserDBType> => {
    return { $or: [
            { email: {$regex: searchEmailTerm ? searchEmailTerm : '', $options: 'i'}},
            {login: {$regex: searchLoginTerm ? searchLoginTerm : '', $options: 'i'}}
        ]
    }
}


export const usersRepository = {
    async getAllUsers(searchLoginTerm: any, searchEmailTerm: any, pageSize: number, sortBy: any, sortDirection: any, pageNumber: any): Promise<UserType[]> {
        const filter = searchLoginAndEmailTermFilter(searchLoginTerm, searchEmailTerm)
        const sortedUsers = await usersCollection.find(filter, {
            projection: {
                _id: 0,
                passwordHash: 0,
                passwordSalt: 0
            }
        }).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({[sortBy]: sortDirection === 'asc' ? 1 : -1}).toArray()
        return sortedUsers
    },
    async createUser(userForSave: UserDBType): Promise<UserDBType> {
        await usersCollection.insertOne(userForSave)
        return userForSave
    },
    async findUserById(id: ObjectId): Promise<UserDBType | null> {
        let user = await usersCollection.findOne({_id: id})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
        return user
    },
    async findByLogin(loginOrEmail: string): Promise<UserDBType | null> {
        return usersCollection.findOne({login: loginOrEmail})
    },
    async getUsersCount(searchLoginTerm: searchLoginOrEmailTermType, searchEmailTerm: searchLoginOrEmailTermType) {
        const filter = searchLoginAndEmailTermFilter(searchLoginTerm, searchEmailTerm)
        return usersCollection.countDocuments(filter)
    },
    async deleteUserById(id: string) {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllUsers() {
        return usersCollection.deleteMany({})
    }
}
///