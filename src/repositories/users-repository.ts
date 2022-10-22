import {usersCollection} from "../db";
import {Filter, ObjectId} from "mongodb";
import {UserDBType, UserType} from "./types";


export const usersRepository = {
    async getAllUsers(searchLoginTerm: any, searchEmailTerm: any, pageSize: number, sortBy: any, sortDirection: any, pageNumber: any): Promise<UserType[]> {
        const filter = {
                email: {$regex: searchEmailTerm ? searchEmailTerm : '', $options: 'i'},
                login: {$regex: searchLoginTerm ? searchLoginTerm : '', $options: 'i'}

        }
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
    async getUsersCount() {

        return usersCollection.countDocuments()
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