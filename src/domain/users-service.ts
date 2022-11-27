import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {UsersRepository} from "../repositories/users-repository";
import {AccountDataType, EmailConfirmationType, PaginationType, UserDBType} from "../types/types";
import {v4 as uuidv4} from 'uuid';
import {add} from 'date-fns'
import {UserViewModel} from "../models/models";
import {EmailService} from "./email-service";

export class UsersService {

    private usersRepository: UsersRepository
    private emailService: EmailService

    constructor() {
        this.usersRepository = new UsersRepository()
        this.emailService = new EmailService()
    }

    async findAllUsers(searchLoginTerm: any, searchEmailTerm: any, pageNumber: any,
                       pageSize: number, sortBy: string, sortDirection: string): Promise<PaginationType> {

        const allUsers = await this.usersRepository.getAllUsers(searchLoginTerm, searchEmailTerm, pageSize, sortBy,
            sortDirection, pageNumber)

        const totalCount = await this.usersRepository.getUsersCount(searchLoginTerm, searchEmailTerm)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: allUsers
        }
    }

    async createUser(login: string, email: string, password: string): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const code = uuidv4()
        const createdAt = new Date
        const expirationDate = add(new Date(), {hours: 2, minutes: 3})
        const user = new UserDBType(
            new ObjectId(),
            new AccountDataType(login, email, passwordHash, createdAt),
            new EmailConfirmationType(code, expirationDate, false)
        )
        const result = await this.usersRepository.createUser(user)

        try {
            await this.emailService.sendEmailRegistrationMessage(user)
        } catch (err) {
            console.error(err)
        }
        return result
    }

    async getUserByUserId(id: string): Promise<UserViewModel | null> {
        const user = await this.usersRepository.findUserByUserId(id)
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
        return await this.usersRepository.deleteUserByUserId(id)
    }

    async findUserByLoginOrEmail(email: string) {
        return await this.usersRepository.findByLoginOrEmail(email)
    }
}

export const usersService = new UsersService()

