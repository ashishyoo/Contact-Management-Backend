import { Pool } from "pg";
import dotenv from "dotenv";
import { DbConfig } from "../types/dbconfig";

dotenv.config();

const dbConfig: DbConfig = {
  user: process.env.DB_USER ?? "",
  host: process.env.DB_HOST ?? "",
  database: process.env.DB_NAME ?? "",
  password: process.env.DB_PASSWORD ?? "",
  port: parseInt(process.env.DB_PORT ?? "5432", 10),
};

if (
  !dbConfig.user ||
  !dbConfig.host ||
  !dbConfig.database ||
  !dbConfig.password ||
  isNaN(dbConfig.port)
) {
  throw new Error("Missing or invalid database configuration");
}

const pool = new Pool(dbConfig);

pool.on("connect", () => {
  console.log("Connection pool established with database");
});

export default pool;
