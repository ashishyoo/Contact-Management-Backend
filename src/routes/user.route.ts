import express from "express";
import {
  registerUser,
  loginUser,
  currentUser,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/currentuser").get(protect, currentUser);

export default router;
