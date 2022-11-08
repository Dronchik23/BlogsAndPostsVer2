import {usersCollection} from "../db";
import {Filter, ObjectId} from "mongodb";
import {BlogType, UserDBType, UserType} from "./types";
import {UserViewModel} from "../models/models";

type searchLoginOrEmailTermType = string | undefined | null

const fromUserDBTypeToUserType = (user: UserDBType): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.accountData.username,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}

const fromUserDBTypeToUserTypeForArray = (user: UserDBType[]): UserViewModel[] => {
    return {
        id: user[0]._id.toString(),
        login: user[1].accountData.username,
        email: user[2].accountData.email,
        createdAt: user[3].accountData.createdAt
    }
}

const searchLoginAndEmailTermFilter = (searchLoginTerm: searchLoginOrEmailTermType, searchEmailTerm: searchLoginOrEmailTermType): Filter<any> => {
    return { $or: [
            { email: {$regex: searchEmailTerm ? searchEmailTerm : '', $options: 'i'}},
            {login: {$regex: searchLoginTerm ? searchLoginTerm : '', $options: 'i'}}
        ]
    }
}


export const usersRepository = {
    async getAllUsers(searchLoginTerm: string, searchEmailTerm: string, pageSize: number, sortBy: string, sortDirection: string, pageNumber: number): Promise<UserViewModel> {
        const filter = searchLoginAndEmailTermFilter(searchLoginTerm, searchEmailTerm)
        const sortedUsers = await usersCollection.find(filter, {
            projection: {
                passwordHash: 0,
                passwordSalt: 0
            }
        }).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
        return fromUserDBTypeToUserTypeForArray(sortedUsers)
    },
    async createUser(userForSave: UserDBType): Promise<UserType> {
        await usersCollection.insertOne(userForSave)
        return fromUserDBTypeToUserType(userForSave)
    },
    async findUserById(id: string): Promise<UserDBType | null> {
        let user = await usersCollection.findOne({id})
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
    async updateConfirmation(id: any) {
        let result = await usersCollection.updateOne({id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
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