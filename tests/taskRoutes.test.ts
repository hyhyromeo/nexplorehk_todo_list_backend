import request from "supertest";
import express from "express";
import taskRoutes from "../routes/taskRoutes";
import { pool } from "./jest.setup";

const app = express();
app.use(express.json());
app.use("/tasks", taskRoutes);

console.log("Database URL:", process.env.DATABASE_URL);

// Before all tests, set up the schema
beforeAll(async () => {
  const setupSchema = async () => {
    try {
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
      console.log("Test TABLE created successfully.");
    } catch (error: any) {
      console.error("Error setting up schema:", error.message);
      throw error;
    }
  };
  await setupSchema();

  await pool.query("BEGIN"); // Starting TEST
  console.log("Connected to PostgreSQL database. Starting test transaction...");
});

// Close the database connection after all tests
afterAll(async () => {
  await pool.query("ROLLBACK"); // Roll back the transaction
  console.log("Test transaction rolled back.");
  await pool.end(); // Close the database connection
  console.log("Database connection closed after all tests.");
});

describe("Task API", () => {
  it("should fetch all tasks", async () => {
    const response = await request(app).get("/tasks");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should create a new task", async () => {
    const response = await request(app).post("/tasks").send({
      title: "New Task",
      description: "Task description",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("New Task");
  });

  it("should update a task", async () => {
    // Insert a task before testing the update
    await pool.query(`
      INSERT INTO tasks (title, description, status) 
      VALUES ('Initial Task', 'Initial description', 'pending')
      RETURNING id;
    `);

    const response = await request(app).put("/tasks/1").send({
      title: "Updated Task",
      description: "Updated description",
      status: "completed",
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("completed");
  });

  it("should delete a task", async () => {
    // Insert a task to ensure there's something to delete
    await pool.query(`
        INSERT INTO tasks (title, description, status)
        VALUES ('Task to be deleted', 'Description', 'pending')
        RETURNING id;
      `);

    const response = await request(app).delete("/tasks/1");
    expect(response.status).toBe(204);
  });
});
