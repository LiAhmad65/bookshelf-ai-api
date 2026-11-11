import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers["authorization"];
    let token:string | undefined  
  // Expected format: "Bearer <token>"
    if(authHeader){
        token = authHeader.split(' ')[1]
    }
  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Access token missing or invalid" });
    return;
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ success: false, message: "Server auth is not configured" });
    return;
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('error',error)
    
    res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
    return;
  }
};
