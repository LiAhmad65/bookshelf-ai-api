import {z} from "zod";

export const addBookSchema= z.object({
    body:z.object
    ({
        name:z.string().min(1,"Book name is required"),
        author:z.string().min(1,"Author is required")
    })
})

export type AddBookSchema =z.infer<typeof addBookSchema>["body"]