import { Router } from "express"
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  getTasksByDate,
  toggleTaskCompletion,
  updateTask,
} from "../controllers/taskController"
import { authenticate } from "../middlewares/authMiddleware"

const router = Router()

// Apply authentication middleware to all routes
router.use(authenticate)

// Task CRUD routes
router.post("/", createTask)
router.get("/", getTasks)
router.get("/by-date", getTasksByDate)
router.get("/:id", getTask)
router.patch("/:id", updateTask)
router.delete("/:id", deleteTask)

// Additional utility routes
router.patch("/:id/toggle-completion", toggleTaskCompletion)

export default router