import {NextFunction, Request, Response} from "express";
import {query} from "express-validator";


const queryPageNumberValidation = query('pageNumber').toInt(10).default(1)
const queryPageSizeValidation = query('pageSize').toInt(10).default(10)



const queryParamsSortByMiddleware = (req: Request, res: Response, next: NextFunction) => {

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
    queryParamsSortByMiddleware
]