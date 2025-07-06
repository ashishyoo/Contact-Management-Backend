import bcrypt from "bcrypt";
import { validateUser } from "../utils/validator";
import pool from "../config/connectDB";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {
  UserRegisterDto,
  UserLoginDto,
  UserResponseDto,
  LoginResponseDto,
} from "../dtos/user.dto";
import { AuthRequest } from "../types/auth";
import { User } from "../types/user";

// @desc Register a user
// @route POST /api/users/register
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = req.body as UserRegisterDto;
    validateUser({ username, email, password });

    // @Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    const user: User = result.rows[0];

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    } as UserResponseDto);
  } catch (error) {
    res.status(409);
    next(new Error("A user with this username or email already exists"));
  }
};

// @desc Login a user
// @route POST /api/users/login
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as UserLoginDto;
    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rows.length === 0) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const user: User = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // @Generate JWT token
    const accessToken = jwt.sign(
      {
        user: { id: user.id, username: user.username, email: user.email },
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "5m",
      }
    );

    res.status(201).json({ accessToken } as LoginResponseDto);
  } catch (error) {
    next(error);
  }
};

// @desc Get current user information
// @route GET /api/users/currentuser
export const currentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, no token provided");
    }

    res.status(200).json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    } as UserResponseDto);
  } catch (error) {
    next(error);
  }
};
