import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/database";
import { jwtGenerator } from "../utils/jwtGenerator";
import { AuthRequest } from "../middleware/veifyJwt";

// Register user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length !== 0) {
      return res.status(401).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password_hashed) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    const token = jwtGenerator(newUser.rows[0].id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error: any) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server Error!" });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Password or Email is incorrect!" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hashed
    );
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Password or Email is incorrect!" });
    }

    const token = jwtGenerator(user.rows[0].id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful!" });
  } catch (error: any) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server Error!" });
  }
};

// Get user profile (protected)
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.user?.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user.rows[0]);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout (clears cookie)
export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout successful." });
  } catch (error: any) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ message: "Server error during logout." });
  }
};
