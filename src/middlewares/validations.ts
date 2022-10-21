import {body, param} from "express-validator";


export const nameValidation = body('name').trim().isLength({min:1, max:15}).isString()
export const youtubeUrlValidation = body('youtubeUrl').trim().isLength({min:0, max:100}).isString().matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
export const titleValidation = body('title').isString().trim().notEmpty().isLength({min:1, max:30})
export const shortDescriptionValidation = body('shortDescription').trim().isLength({min:1, max:100}).notEmpty().isString()
export const contentValidation = body('content').trim().isLength({min:1, max:1000}).notEmpty().isString()
export const bodyBlogIdValidation = body('blogId').trim().isLength({min:13, max:13}).notEmpty().isString()
export const paramsBlogIdValidation = param('blogId').trim().notEmpty().isString()
export const paramsPostIdValidation = param('id').trim().notEmpty().isString()

export const loginValidation = body('login').isString().trim().notEmpty().isLength({min:3, max:10})
export const passwordValidation = body('password').trim().isLength({min:6, max:20}).isString()
export const emailValidation = body('email').trim().isLength({min:3, max:100}).isString().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)