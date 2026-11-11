import {Request, Response, NextFunction} from 'express'
import {ZodType} from 'zod'

export const validate = (schema:ZodType)=>(req:Request, res:Response, next:NextFunction)=>{
    const result = schema.safeParse({body:req.body})
    if (!result.success) {
        const errors = result.error.issues.map(issue => ({
            field: issue.path.slice(1).join('.'),
            message: issue.message
        }))
        return res.status(400).json({success:false, message: errors[0]?.message, errors})
    }
    next()
}
