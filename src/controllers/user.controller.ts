import { Request, Response } from "express";
import {
  registerUserService,
  loginUserService,
  getUserByIdService,
} from "../services/authService";

export const registerUserController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { body } = req;
  try {
    const result = await registerUserService(body);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "User not created" });
    }
    return res.status(201).json({
      success: true,
      message: "User created sucessfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
};

export const loginUserController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { body } = req;
  try {
    const result = await loginUserService(body);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      sucess: false,
      message: error.message || "Login failed",
    });
  }
};

export const getUserByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  if (!id) {
    throw new Error("Id required");
  }
  try {
    const result = await getUserByIdService(id);
    if (!result) {
      return res.status(400).json({ succes: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      succes: false,
      message: "Internal Server Error",
    });
  }
};
