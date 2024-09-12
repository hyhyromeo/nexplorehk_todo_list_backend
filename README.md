# nexplorehk_todo_list_backend

    The NexploreHK Todo List Backend is a RESTful API built to manage a Todo List, allowing users to perform CRUD operations on tasks. This project demonstrates the full backend development lifecycle, including environment setup, database integration, API development, and testing.

### Features

    • Create, Read, Update, and Delete tasks.

    • Transaction management to maintain data consistency.

    • Error handling and validation for robust API responses.

    • Unit and integration tests using Jest to ensure code quality.

    • Docker integration for easy database management and consistency across environments.

### Technologies Used

    • Node.js

    • Express

    • PostgreSQL

    • Jest

    • Docker

    • Supertest

### Ensure you have the following installed:

    • Node.js (v14.x or later)

    • npm (v6.x or later)

    • Docker (for database setup)

    • PostgreSQL (optional, if not using Docker)

### To start up the project :

1.  Installation

    - Using npm:

      1. Clone the repository:

         ```bash
             $ git clone https://github.com/yourusername/nexplorehk_todo_list_backend.git
             $ cd nexplorehk_todo_list_backend
         ```

      2. Install dependencies:

         ```bash
             $ npm install
         ```

2.  Environment Variables

    - Create a .env file in the root of the project with the following variables:

      ```.env
          DATABASE_URL=postgresql://username:password@localhost:5432/nexplorehk_todo_list
          PORT=3000
          NODE_ENV=development
      ```

    - Create a .env.test file for test environment setup:

      ```.env.test
      DATABASE_URL=postgresql://username:password@localhost:5432/nexplorehk_todo_list_test
      NODE_ENV=test
      ```

3.  Database Setup

    - Using Docker to set up PostgreSQL using Docker, run the following command:
      ```bash
         $ docker-compose up -d
      ```

4.  Running the Application

    - Start the server:

      ```bash
      $ npm run dev
      ```

    - The server will start on http://localhost:8080.

5.  Testing

    - Run the tests using Jest to ensure all functionalities work as expected:

      ```bash
      $ npm test
      ```

### API Documentation

    Endpoints

        •	GET /tasks: Fetch all tasks.
        •	GET /tasks/todoTasks: Fetch all pending tasks.
        •	GET /tasks/inProgressTasks: Fetch all inProgress tasks.
        •	GET /tasks/completedTasks: Fetch all completed tasks.
        •	POST /tasks: Create a new task.
        •	PUT /tasks/:id: Update a task by ID.
        •	DELETE /tasks/:id: Delete a task by ID.
