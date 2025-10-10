import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import pool from "../database/pool";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization; // getting the - Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' from headers

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  /* 
  The header format is "Bearer <token>".
  So we split by space:
  [0] = "Bearer"
  [1] = "<token>" 
  */
  const token = authHeader.split(" ")[1]; // extract the token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
      id: number;
    };
    const { rows } = await pool.query(
      "SELECT id, email, status FROM users WHERE id = $1",
      [decoded.id]
    );
    const user = rows[0];

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.status === "blocked")
      return res.status(403).json({ message: "User is blocked" });

    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
