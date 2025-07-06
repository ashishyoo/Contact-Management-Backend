import express from "express";
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contact.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect);
router.route("/").get(getContacts);
router.route("/:id").get(getContact);
router.route("/").post(createContact);
router.route("/:id").put(updateContact);
router.route("/:id").delete(deleteContact);

export default router;
