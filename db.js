import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


const pool = mysql
    .createPool({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    })
    .promise();



export async function getToDoById(id) {
    const [row] = await pool.query(
        `SELECT * FROM to_dos WHERE id_to_do = ?`,
        [id]
    )
    return row[0];
}


export async function getTodosByID(id = 1) {
    const [rows] = await pool.query(
        `
        SELECT to_dos.*, shared_to_dos.shared_with_id
        FROM to_dos
        LEFT JOIN shared_to_dos ON to_dos.id_to_do = shared_to_dos.id_to_do
        WHERE to_dos.id_user = ? OR shared_to_dos.shared_with_id = ?
        `,
        [id, id]
    );
    return rows;
}

export async function getTodo(id) {
    const [rows] = await pool.query(
        `SELECT * FROM todos WHERE id = ?`, 
        [id]
    );
    return rows[0];
}

export async function getSharedTodoByID(id) {
    const [rows] = await pool.query(
        `SELECT * FROM shared_to_dos WHERE id_to_do = ?`,
        [id]
    );
    return rows[0];
}

export async function getUserByID(id) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id_user = ?`, [id]);
    return rows[0];
}


export async function getUserByEmail(email) {
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE email = ?`, 
        [email]
    );
    // console.log(rows[0]);
    return rows[0];
}

export async function createTodo(id_user, title) {
    const [result] = await pool.query(
        `INSERT INTO to_dos (id_user, title)
        VALUES (?, ?)`,
        [id_user, title]
    );
    const todoID = result.insertId;
    return getTodo(todoID);
}

export async function deleteTodo(id) {
    const [result] = await pool.query(
        `DELETE FROM to_dos WHERE id_to_do = ?;`,
        [id]
    );
    return result;
}

export async function toggleCompleted(id, value) {
    const newValue = value === true ? "TRUE" : "FALSE";
    const [result] = await pool.query(
        `UPDATE to_dos
        SET completed = ${newValue} 
        WHERE id_to_do = ?;`,
        [id]
    );
    return result;
}

export async function shareTodo(id_to_do = 2, id_user = 1, shared_with_id = 2) {
    const [result] = await pool.query(
        `
        INSERT INTO shared_to_dos (id_to_do, id_user, shared_with_id) 
        VALUES (?, ?, ?);`,
        [id_to_do, id_user, shared_with_id]
    );
    return result.insertId;
}