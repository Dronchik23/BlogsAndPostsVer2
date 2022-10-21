import {NextFunction, Request, Response} from "express";
import {query} from "express-validator";


const queryPageNumberValidation = query('pageNumber').toInt(10).default(1)
const queryPageSizeValidation = query('pageSize').toInt(10).default(10)



const queryParamsParsingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //searchNameTerm
    const defaultSearchNameTerm = {}
    // забрали searchNameTerm из квэри
    let searchNameTerm = req.query.searchNameTerm
    // написали логику на searchNameTerm  (изменили его на дефолтное или нормальное значение)
    if (!searchNameTerm) {
        searchNameTerm = defaultSearchNameTerm
    } else {
        // searchNameTerm = {name: {$regex: searchNameTerm}}
        searchNameTerm = {$or: [{name: {$regex: searchNameTerm}}, {name: {$regex: searchNameTerm.toString().toLowerCase()}}]}
    }
    // перезисали квэри нужным значением
    req.query.searchNameTerm = searchNameTerm
    // SearchEmailTerm
    const defaultSearchEmailTerm = {}
    let searchEmailTerm = req.query.searchEmailTerm
    if (!searchEmailTerm) {
        searchEmailTerm = defaultSearchEmailTerm
    } else {
        searchEmailTerm = {$or: [{email: {$regex: searchEmailTerm}}, {email: {$regex: searchEmailTerm.toString().toLowerCase()}}]}
    }
    req.query.searchEmailTerm = searchEmailTerm
    //searchLoginTerm
    const defaultSearchLoginTerm = {}
    let searchLoginTerm = req.query.searchLoginTerm
    if (!searchLoginTerm) {
        searchLoginTerm = defaultSearchLoginTerm
    } else {
        searchLoginTerm = {$or: [{login: {$regex: searchLoginTerm}}, {login: {$regex: searchLoginTerm.toString().toLowerCase()}}]}
    }
    req.query.searchLoginTerm = searchLoginTerm
    //sortBy
    const defaultSortBy = 'createdAt'
    let sortBy = req.query.sortBy
    if (!sortBy) {
        sortBy = defaultSortBy
    } else {
        sortBy = sortBy
    }
    req.query.sortBy = sortBy
    return next()
}

export const queryParamsMiddleware = [queryPageNumberValidation, queryPageSizeValidation,
    //queryParamsParsingMiddleware
]