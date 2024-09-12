import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Check Database Connection
pool.connect(async (err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
  } else {
    console.log("Connected to PostgreSQL database");
    const setupSchema = async () => {
      try {
        // Check if the tasks table already exists
        const result = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'tasks'
          );
        `);
        const tableExists = result.rows[0].exists;

        if (tableExists) {
          console.log(
            "Tasks table already exists. Skipping schema setup and dummy data insertion."
          );
          return; // Exit if the table already exists
        }

        // Create the tasks table if it doesn't exist
        await pool.query(`
          CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Insert dummy data into the tasks table
        await pool.query(`
          INSERT INTO tasks (title, description, status)
          VALUES 
            ('Task 1', 'Description for task 1', 'pending'),
            ('Task 2', 'Description for task 2', 'inprogress'),
            ('Task 3', 'Description for task 3', 'completed'),
            ('Task 4', 'Description for task 4', 'pending');
        `);

        console.log("setupSchema successfully, including dummy data.");
      } catch (error: any) {
        console.error("Error setting up schema:", error.message);
        throw error;
      }
    };
    await setupSchema();
    release();
  }
});

// Get All Tasks from Database
export const getAllTasks = async () => {
  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY created_at DESC"
  );
  return result.rows;
};
export const getTodoTasks = async () => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE status = 'pending' ORDER BY created_at DESC"
  );
  return result.rows;
};
export const getInProgressTasks = async () => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE status = 'inprogress' ORDER BY created_at DESC"
  );
  return result.rows;
};
export const getCompletedTasks = async () => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE status = 'completed' ORDER BY created_at DESC"
  );
  return result.rows;
};

// Create Task
export const createTask = async (title: string, description: string) => {
  const result = await pool.query(
    "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
    [title, description]
  );
  return result.rows[0];
};

// Update Task
export const updateTask = async (
  id: number,
  title: string,
  description: string,
  status: "pending" | "inprogress" | "completed"
) => {
  const result = await pool.query(
    "UPDATE tasks SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
    [title, description, status, id]
  );
  return result.rows[0];
};

// Delete Task
export const deleteTask = async (id: number) => {
  await pool.query(
    "UPDATE tasks SET status = 'deleted', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
    [id]
  );
};
