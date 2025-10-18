// src/middleware/verifyJwt.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/database";
import { AuthSuccessResponse, ErrorResponse } from "../types/ResponseTypes";

dotenv.config();

export interface AuthRequest extends Request {
  user?: { id: number };
}

export const verifyJwt = async (
  req: AuthRequest,
  res: Response<AuthSuccessResponse | ErrorResponse>,
  next: NextFunction
) => {
  try {
    const jwtToken =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!jwtToken) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const secret = process.env.JWT_SECRET as string;
    if (!secret) throw new Error("JWT_SECRET not defined");

    const decoded = jwt.verify(jwtToken, secret) as JwtPayload;

    const result = await pool.query(
      "SELECT id, status FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    const user = result.rows[0];

    // Check user status
    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Please contact support.",
      });
    }
    req.user = { id: decoded.id as number };
    next();
  } catch (error: any) {
    console.error("JWT Verification error", error.message);
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token!" });
  }
};
