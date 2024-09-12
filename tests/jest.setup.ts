import { Pool, Client } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

// Main database connection (without "_test") to create the test database
const mainDBConnectionString = process.env.DATABASE_URL!.replace("_test", "");

const setupTestDB = async () => {
  // Use a direct client to create the test database without transactions
  const client = new Client({ connectionString: mainDBConnectionString });

  try {
    await client.connect();
    // Attempt to create the test database
    await client.query("CREATE DATABASE nexplorehk_todo_list_test");
    console.log("Test database created successfully.");
  } catch (error: any) {
    if (error.code === "42P04") {
      // Duplicate database error
      console.log("Test database already exists.");
    } else {
      console.error("Error creating test database:", error.message);
      throw error; // Let Jest handle unexpected errors
    }
  } finally {
    await client.end(); // Ensure the client is closed
  }
};

// Connect to the test database to set up the schema
const testDBConnectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: testDBConnectionString });

const setupSchema = async () => {
  try {
    // Directly execute SQL to create tables
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

// Ensure both database creation and schema setup are completed before tests run
const setupTestEnvironment = async () => {
  await setupTestDB(); // Create the test database
  //   await setupSchema(); // Set up the schema in the test database
};

// Run the setup function
setupTestEnvironment()
  .then(() => {
    console.log("Test environment setup complete.");
  })
  .catch((error) => {
    console.error("Database setup failed:", error.message);
  });

// Export the pool for use in your tests
export { pool };
