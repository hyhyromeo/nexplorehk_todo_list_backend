import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTodoTasks,
  getInProgressTasks,
  getCompletedTasks,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks); // GET tasks
router.get("/todoTasks", getTodoTasks); // GET task
router.get("/inProgressTasks", getInProgressTasks); // GET task
router.get("/completedTasks", getCompletedTasks); // GET task
router.post("/", createTask); // CREATE task
router.put("/:id", updateTask); // UPDATE task
router.put("/delete/:id", deleteTask); // DELETE task

export default router;
