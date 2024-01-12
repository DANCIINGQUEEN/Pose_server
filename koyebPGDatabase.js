import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.PG_TUTORIAL1_USER,
  host: process.env.PG_TUTORIAL1_HOST,
  password: process.env.PG_TUTORIAL1_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  database: process.env.PG_TUTORIAL1_NAME,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log(`Connected to database ${process.env.PG_TUTORIAL1_NAME}`);
  release();
});

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        nickname VARCHAR(100),
        age INT,
        wealth BIGINT,
        is_married BOOLEAN
    );
  `;

  try {
    await pool.query(query);
    console.log('Table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

createTable();

export default pool;
