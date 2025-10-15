// src/middleware/verifyJwt.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: { id: number };
}

export const verifyJwt = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtToken =
      req.cookies?.token || // cookie-based (из cookie)
      req.header("Authorization")?.replace("Bearer ", ""); // header-based (на всякий случай)

    if (!jwtToken) {
      return res
        .status(403)
        .json({ message: "Access denied. No token provided." });
    }

    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(jwtToken, secret) as JwtPayload;

    req.user = { id: decoded.id as number };
    next();
  } catch (error: any) {
    console.error("JWT Verification error", error.message);
    res.status(403).json({ message: "Invalid or expired token!" });
  }
};
