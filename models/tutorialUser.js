import pool from "../koyebPGDatabase.js";

export const createUser = async (userData) => {
  const { name,  nickname, age, wealth, isMarried } = userData;
  const query = `
    INSERT INTO users(name, nickname, age, wealth, is_married)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;
  const values = [name, nickname, age, wealth, isMarried];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error(err);
  }
};

export const getAllUsers = async () => {
  const query = `
      SELECT * FROM users;
      `;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error(err);
  }
};

export const getUserById = async (userId) => {
  const query = `
    SELECT * FROM users
    WHERE id=$1;
    `;
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error(err);
  }
};

export const updateUser = async (userId, userData) => {
  const { name, nickname, age, wealth, isMarried } = userData;
  const query = `
      UPDATE users
      SET name = $1, nickname = $2, age = $3, wealth = $4, is_married = $5
      WHERE id = $6
      RETURNING *;
    `;
  const values = [name, nickname, age, wealth, isMarried, userId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

export const deleteUser = async (userId) => {
  const query = "DELETE FROM users WHERE id = $1 RETURNING *;";
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};
