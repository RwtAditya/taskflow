const pool = require("../db/db");

exports.getTasks = async (userId) => {
    const query = "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC";

    const result = await pool.query(query, [userId]);
    return result.rows;
}

exports.createTask = async (userId, title, description, category,due_date, status) => {
    const query = "INSERT INTO tasks (user_id, title, description, category, due_date, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *";
    const result = await pool.query(query, [userId,title,description,category,due_date,status]);

    return result.rows[0];
}

exports.updateTask = async (taskId, userId, title, description, category,due_date, status) => {
    const query = "UPDATE tasks SET title = $1, description =$2, category = $3, due_date = $4, status=$5 WHERE id = $6 AND user_id = $7 RETURNING *";
    const result = await pool.query(query, [title,description,category,due_date,status,taskId,userId]);

    return result.rows[0];
}

exports.deleteTask = async (taskid, userId) => {
    const query = "DELETE FROM tasks WHERE id = $1 AND user_id = $2";
    const result = await pool.query(query, [taskid, userId]);

    return result.rowCount;
}
