import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../database/pool";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query =
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email";

  const { rows } = await pool.query(query, [name, email, hashedPassword]);
  res.json({ message: "User created", user: rows[0] });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userRes = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  const user = userRes.rows[0];
  if (!user) return res.status(404).json({ message: "User not found!" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ message: "Incorrect password!" });

  await pool.query("UPDATE users SET last_login_time = NOW() WHERE id = $1", [
    user.id,
  ]);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  }); // creates token using jwt, first is ID of the user, then JWT_SECRET from .env, expires in 1hour
  res.json({ token });
};
