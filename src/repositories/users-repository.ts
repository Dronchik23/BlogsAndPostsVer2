import "reflect-metadata";
import {usersCollection} from "../db";
import {Filter, ObjectId} from "mongodb";
import {UserDBType} from "../types/types";
import {UserViewModel} from "../models/models";
import {injectable} from "inversify";

type searchLoginOrEmailTermType = string | undefined

const fromUserDBTypeToUserViewModel = (user: UserDBType): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}

const fromUserDBTypeToUserViewModelWithPagination = (users: UserDBType[]): UserViewModel[] => {
    return users.map(user => ({
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }))
}

const searchLoginAndEmailTermFilter = (searchLoginTerm: searchLoginOrEmailTermType,
                                       searchEmailTerm: searchLoginOrEmailTermType): Filter<any> => {
    return {
        $or: [
            {"accountData.email": {$regex: searchEmailTerm ? searchEmailTerm : '', $options: 'i'}},
            {"accountData.userName": {$regex: searchLoginTerm ? searchLoginTerm : '', $options: 'i'}}
        ]
    }
}
@injectable()
export class UsersRepository {
    async getAllUsers(searchLoginTerm: string, searchEmailTerm: string, pageSize: number,
                      sortBy: string, sortDirection: string, pageNumber: number): Promise<UserViewModel[]> {
        const filter = searchLoginAndEmailTermFilter(searchLoginTerm, searchEmailTerm)
        const sortedUsers = await usersCollection.find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .toArray()

        return fromUserDBTypeToUserViewModelWithPagination(sortedUsers)

    }
    async createUser(userForSave: UserDBType): Promise<UserViewModel> {
        await usersCollection.insertOne(userForSave)
        return fromUserDBTypeToUserViewModel(userForSave)
    }
    async findUserByUserId(id: string): Promise<UserViewModel | null> {
        let user = await usersCollection.findOne({_id: new ObjectId(id)})
        if (user) {
            return fromUserDBTypeToUserViewModel(user)
        } else {
            return null
        }
    }
    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({
            $or: [{"accountData.email": loginOrEmail},
                {"accountData.login": loginOrEmail}]
        })
        return user
    }
    async findByEmail(email: string) {
        return await usersCollection.findOne({'accountData.email': email})

    }
    async findUserByConfirmationCode(code: string) {
        const user = await usersCollection.findOne({"emailConfirmation.confirmationCode": code})
        return user
    }
    async updateConfirmation(userId: ObjectId) {
        let result = await usersCollection.updateOne({id: userId}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }
    async getUsersCount(searchLoginTerm: searchLoginOrEmailTermType, searchEmailTerm: searchLoginOrEmailTermType) {
        const filter = searchLoginAndEmailTermFilter(searchLoginTerm, searchEmailTerm)
        return usersCollection.countDocuments(filter)
    }
    async deleteUserByUserId(id: string) {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
    async deleteAllUsers() {
        return usersCollection.deleteMany({})
    }
    async updateConfirmationCodeByUserId(userId: ObjectId, newConfirmationCode: string) {
        let result = await usersCollection.updateOne({id: userId}, {$set: {'emailConfirmation.confirmationCode': newConfirmationCode}})
        return result.modifiedCount === 1
    }
}


