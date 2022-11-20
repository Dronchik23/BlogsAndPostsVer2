import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {PaginationType, UserDBType, UserType} from "../types/types";
import {v4 as uuidv4} from 'uuid';
import {add} from 'date-fns'
import {UserViewModel} from "../models/models";
import {emailService} from "./email-service";

class UsersService {
    async findAllUsers(searchLoginTerm: any, searchEmailTerm: any, pageNumber: any,
                       pageSize: number, sortBy: string, sortDirection: string): Promise<PaginationType> {

        const allUsers = await usersRepository.getAllUsers(searchLoginTerm, searchEmailTerm, pageSize, sortBy,
            sortDirection, pageNumber)

        const totalCount = await usersRepository.getUsersCount(searchLoginTerm, searchEmailTerm)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: allUsers
        }
    }
    async createUser(login: string, email: string, password: string): Promise<UserType> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const user: UserDBType = {
            _id: new ObjectId(),
            id: (+(new Date())).toString(),
            accountData: {
                userName: login,
                email,
                passwordHash,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 2, minutes: 3}),
                isConfirmed: false,
            }
        }
        const result = await usersRepository.createUser(user)

        try {
            await emailService.sendEmailRegistrationMessage(user)
        } catch (err) {
            console.error(err)
            await usersRepository.deleteUserById(user.id)
        }
        return result
    }
    async getUserByUserId(id: string): Promise<UserViewModel | null> {
        const user = await usersRepository.findUserById(id)
        if (user) {
            return user
        } else {
            return null
        }
    }
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
    async deleteUserByUserId(id: string) {
        return await usersRepository.deleteUserById(id)
    }
    async findUserByLoginOrEmail(email: string) {
        return await usersRepository.findByLoginOrEmail(email)
    }
}

export const usersService = new UsersService()

