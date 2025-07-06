import express, { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import cors from "cors";
import errorHandler from "./middleware/error.middleware";
import pool from "./config/connectDB";
import contactRoutes from "./routes/contact.route";
import userRoutes from "./routes/user.route";
import createContactTable from "./models/contact.model";
import createUserTable from "./models/user.model";

config();
const app = express();
const PORT = parseInt(process.env.PORT ?? "5000", 10);

app.use(cors());
app.use(express.json());

// @Initialize database table
const initializeDatabase = async (): Promise<void> => {
  try {
    await createUserTable();
    await createContactTable();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
};

initializeDatabase();

app.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await pool.query("SELECT current_database()");
      res
        .status(200)
        .send(`The database name is ${result.rows[0].current_database}`);
    } catch (error) {
      next(error);
    }
  }
);

app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
