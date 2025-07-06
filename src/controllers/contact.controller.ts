import pool from "../config/connectDB";
import { validateContact } from "../utils/validator";
import { Response, NextFunction } from "express";
import { ContactCreateDto, ContactResponseDto } from "../dtos/contact.dto";
import { AuthRequest } from "../types/auth";

// @desc Get all contacts for the authenticated user
// @route GET /api/contacts
export const getContacts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const result = await pool.query(
      "SELECT * FROM contacts WHERE user_id = $1",
      [userId]
    );
    res.status(200).json(result.rows as ContactResponseDto[]);
  } catch (error) {
    next(error);
  }
};

// @desc Get a single contact for the authenticated user
// @route GET /api/contacts/:id
export const getContact = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user?.id;

    if (isNaN(id)) {
      res.status(400);
      throw new Error("Invalid contact ID");
    }

    const result = await pool.query(
      "SELECT * FROM contacts WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (result.rows.length === 0) {
      res.status(404);
      throw new Error(
        "Contact not found or you don't have access to this contact"
      );
    }
    res.status(200).json(result.rows[0] as ContactResponseDto);
  } catch (error) {
    next(error);
  }
};

// @desc Create a new contact for the authenticated user
// @route POST /api/contacts
export const createContact = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone } = req.body as ContactCreateDto;
    const userId = req.user?.id;
    validateContact({ name, email, phone });

    const result = await pool.query(
      "INSERT INTO contacts (user_id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, name, email, phone]
    );
    res.status(201).json(result.rows[0] as ContactResponseDto);
  } catch (error) {
    res.status(409);
    next(new Error("A contact with this email or phone already exists"));
  }
};

// @desc Update a contact for the authenticated user
// @route PUT /api/contacts/:id
export const updateContact = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user?.id;

    if (isNaN(id)) {
      res.status(400);
      throw new Error("Invalid contact ID");
    }
    const { name, email, phone } = req.body as ContactCreateDto;
    validateContact({ name, email, phone });

    const result = await pool.query(
      "UPDATE contacts SET name=$1, email=$2, phone=$3 WHERE id=$4 AND user_id=$5 RETURNING *",
      [name, email, phone, id, userId]
    );
    if (result.rows.length === 0) {
      res.status(404);
      throw new Error(
        "Contact not found or you don't have access to this contact"
      );
    }
    res.status(200).json(result.rows[0] as ContactResponseDto);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a contact for the authenticated user
// @route DELETE /api/contacts/:id
export const deleteContact = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user?.id;

    if (isNaN(id)) {
      res.status(400);
      throw new Error("Invalid contact ID");
    }

    const result = await pool.query(
      "DELETE FROM contacts WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, userId]
    );
    if (result.rows.length === 0) {
      res.status(404);
      throw new Error(
        "Contact not found or you don't have access to this contact"
      );
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};
