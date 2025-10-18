import type { Request, Response, NextFunction } from "express";
import { AuthSuccessResponse, ErrorResponse } from "../types/ResponseTypes";

export const validInfo = (
  req: Request,
  res: Response<AuthSuccessResponse | ErrorResponse>,
  next: NextFunction
) => {
  const { email, name, password } = req.body;

  function validateEmail(email: string): boolean {
    // Basic email regex pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  if (req.path === "/register") {
    if (![email, name, password].every(Boolean)) {
      return res
        .status(401)
        .json({ success: false, message: "Missing Credentials!" });
    } else if (!validateEmail(email)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email!" });
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res
        .status(401)
        .json({ success: false, message: "Missing Credentials!" });
    } else if (!validateEmail(email)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email!" });
    }
  }

  next();
};
