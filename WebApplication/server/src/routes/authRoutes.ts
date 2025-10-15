import express from "express";
import {
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController";
import { validInfo } from "../middleware/validInfo";
import { verifyJwt } from "../middleware/veifyJwt";

const router = express.Router();

// Register Route
router.post("/register", validInfo, registerUser);

// Login Route
router.post("/login", validInfo, loginUser);

// Get User
router.get("/me", verifyJwt, getUserById);

// Get User
router.post("/logout", logoutUser);

export default router;
