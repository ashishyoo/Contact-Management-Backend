import pool from "../config/connectDB";

const createUserTable = async (): Promise<void> => {
  const queryTxt = `
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  try {
    await pool.query(queryTxt);
    console.log("Users table created if not exists");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
};

export default createUserTable;
