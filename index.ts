import dotenv from "dotenv";
dotenv.config();
import express from "express";
import taskRoutes from "./routes/taskRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(errorHandler);
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
  })
);
// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Todo List API");
});
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
