import {z} from 'zod';

export const signupSchema = z.object({
    body:z.object({
        name:z.string().min(3, "Name must atleast 3 characters"),
        email:z.string().email("Invalid email address"),
        password:z.string().min(6,"Password must be atleast 6 characters")
    })
})

export const loginSchema = z.object({
    body:z.object({
        email:z.string().email("Invalid email adress"),
        password:z.string().min(6,"Password must be atleast 6 characters")
    })
})


export type SignupInput = z.infer<typeof signupSchema>['body']
export type LoginInput = z.infer<typeof loginSchema>['body']
