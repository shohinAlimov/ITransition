import type { Request, Response, NextFunction } from "express";

export const validInfo = (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password } = req.body;

  function validateEmail(email: string): boolean {
    // Basic email regex pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  if (req.path === "/register") {
    if (![email, name, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials!");
    } else if (!validateEmail(email)) {
      return res.status(401).json("Invalid Email!");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials!");
    } else if (!validateEmail(email)) {
      return res.status(401).json("Invalid Email!");
    }
  }

  next();
};
