import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {PaginationType, UserDBType, UserType} from "../repositories/types";
import {isBooleanObject} from "util/types";


const fromUserDBTypeToUserType = (user: UserDBType): UserType => {
    return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}

export const usersService = {
    async findAllUsers(searchLoginTerm: any, searchEmailTerm: any, pageSize: any, sortBy: any, sortDirection: any, pageNumber: any, filter: any): Promise<PaginationType> {
        const allUsers = await usersRepository.getAllUsers(searchLoginTerm, searchEmailTerm, pageSize, sortBy, sortDirection, pageNumber)
        const totalCount = await usersRepository.getUsersCount(searchLoginTerm, searchEmailTerm)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: allUsers
        }
    },
    async createUser(login: string, email: string, password: string): Promise<UserType> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            _id: new ObjectId(),
            id: (+(new Date())).toString(),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date()
        }
        await usersRepository.createUser(newUser)
        console.log(newUser)
        return fromUserDBTypeToUserType(newUser)
    },
    async findUserById(id: string): Promise<UserType | null> {
        const user = await usersRepository.findUserById(id)
        if (!user) return null
        return fromUserDBTypeToUserType(user)
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<any> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return false
        }
        return user
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async deleteUserById(id: string) {
        return await usersRepository.deleteUserById(id)
    }
}