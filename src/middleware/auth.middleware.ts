import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { UserResponseDto } from "../dtos/user.dto";
import { AuthRequest } from "../types/auth";

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    // @Check for token in Authorization header
    if (
      authHeader &&
      typeof authHeader === "string" &&
      authHeader.startsWith("Bearer")
    ) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token provided");
    }

    // @Verify token
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.user = (decoded as { user: UserResponseDto }).user;
      next();
    });
  } catch (error) {
    next(error);
  }
};
