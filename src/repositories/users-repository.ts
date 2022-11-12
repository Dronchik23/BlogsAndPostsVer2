import {usersCollection} from "../db";
import {Filter} from "mongodb";
import { UserDBType, UserType} from "../types/types";
import {UserViewModel} from "../models/models";
//
type searchLoginOrEmailTermType = string | undefined

const fromUserDBTypeToUserType = (user: UserDBType): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.accountData.userName,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}

const fromUserDBTypeToUserTypeForArray = (users: UserDBType[]): UserViewModel[] => {
    return users.map(u => ({
        id: u._id.toString(),
        login: u.accountData.userName,
        email: u.accountData.email,
        createdAt: u.accountData.createdAt
    }))
}

const searchLoginAndEmailTermFilter = (searchLoginTerm: searchLoginOrEmailTermType,
                                       searchEmailTerm: searchLoginOrEmailTermType): Filter<any> => {
    return { $or: [
            { "accountData.email": {$regex: searchEmailTerm ? searchEmailTerm : '', $options: 'i'}},
            {"accountData.userName": {$regex: searchLoginTerm ? searchLoginTerm : '', $options: 'i'}}
        ]
    }
}

export const usersRepository = {
    async getAllUsers(searchLoginTerm: any, searchEmailTerm: any, pageSize: number,
                      sortBy: string, sortDirection: string, pageNumber: number): Promise<UserViewModel[]> {

        const filter = searchLoginAndEmailTermFilter(searchLoginTerm, searchEmailTerm)
        const sortedUsers = await usersCollection.find(filter).skip((pageNumber - 1) * pageSize).limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1}).toArray()

        return fromUserDBTypeToUserTypeForArray(sortedUsers)

    },
    async createUser(userForSave: UserDBType): Promise<UserType> {
        await usersCollection.insertOne(userForSave)
        return fromUserDBTypeToUserType(userForSave)
    },
    async findUserById(id: string): Promise<UserViewModel | null> {
        let user = await usersCollection.findOne({id})
        if (user) {
            return fromUserDBTypeToUserType(user)
        } else {
            return null
        }
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({$or: [{"accountData.email": loginOrEmail},
                {"accountData.userName": loginOrEmail}]})
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
