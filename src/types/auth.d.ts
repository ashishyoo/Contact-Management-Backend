import { Request } from "express";
import { UserResponseDto } from "../dtos/user.dto";

export interface AuthRequest extends Request {
  user?: UserResponseDto;
}
