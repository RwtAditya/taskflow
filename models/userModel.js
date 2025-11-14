const pool = require("../db/db");

exports.createUser = async (username, email, password) => {
    const query = "INSERT INTO users (username, email, password) VALUES($1,$2,$3)";
    const result = await pool.query(query, [username,email,password]);
}

exports.findByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
}

