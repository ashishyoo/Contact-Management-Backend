import pool from "../config/connectDB";

const createContactTable = async (): Promise<void> => {
  const queryTxt = `
    CREATE TABLE IF NOT EXISTS contacts(
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(15) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  try {
    await pool.query(queryTxt);
    console.log("Contacts table created if not exists with user_id");
  } catch (error) {
    console.error("Error creating contacts table:", error);
    throw error;
  }
};

export default createContactTable;
