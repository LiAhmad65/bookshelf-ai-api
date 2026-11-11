import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Users } from "../models/users";
import { LoginInput, SignupInput } from "../validations/authValidation";

const JWT_SECRET = process.env.JWT_SECRET || "shhhhh";

// Create User
export const registerUserService = async (payload: SignupInput) => {
  const { email, name, password } = payload;
  // 1. Check if user already exists
  const existingUser = await Users.findOne({ email: email });
  if (existingUser) {
    throw new Error("User Already exists with this email");
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Initiate the user with hashed password
  const newUser = new Users({
    email,
    name,
    password: hashedPassword,
  });

  // 4. Saved User in mongoDB
  await newUser.save();

  // 5. Generate JWT Token
  const token = jwt.sign(
    { userId: newUser._id, email: newUser.email },
    JWT_SECRET,
  );

  // 6. Convert user object to plain object and remove sensitive data for FE response
  const userObject = newUser.toObject();
  delete userObject.password;
  return { user: newUser, token };
};

// Login User
export const loginUserService = async (payload: LoginInput) => {
  const { email, password } = payload;

  // 1. Find the user in the DB
  const user = await Users.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or Password");
  }

  // 2. Compare plain password with hashed passwrd
  const isvalidPassword = await bcrypt.compare(
    password,
    user.password as string,
  );
  if (!isvalidPassword) {
    throw new Error("Invalid email or password");
  }

  // 3. Generate fresh JWT token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

  // 4. Exclude password before returning user for FE response
  const userObject = user.toObject();
  delete userObject.password;

  // 5. return user nad token
  return { user: userObject, token };
};

export const getUserByIdService = async(id:string)=>{
  const user = await Users.findOne({_id:id})
  if(!user){
    throw new Error("User not found")
  }
  return user;
}