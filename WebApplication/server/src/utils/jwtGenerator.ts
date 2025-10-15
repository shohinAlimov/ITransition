import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
  id: number;
}

export function jwtGenerator(user_id: number): string {
  const payload: JwtPayload = { id: user_id };

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined");

  return jwt.sign(payload, secret, { expiresIn: "1h" });
}
