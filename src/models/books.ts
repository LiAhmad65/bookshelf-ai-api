import {Schema, model, Document} from 'mongoose'

// 1. Define Interface
export interface IBook{
    name:string,
    author:string,
    description?:string
}

// 2. Interface for Mongoose Document (includes MongoDB _id and methods)

export interface IBooksDocument extends IBook, Document{}

// 3. Define schema

const bookSchema = new Schema<IBooksDocument>(
    {
        name:{type:String,required:true},
        author:{type:String, required:true},
        description:{type:String}
    },
    {timestamps:true}
)

export const Books = model<IBooksDocument>("Book",bookSchema)