import { Schema, model, Document } from "mongoose";

// 1. Typescript Interface

export interface IUser {
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Mongoose Document (includes MongoDB _id and methods)
export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Users = model<IUserDocument>('User', userSchema)