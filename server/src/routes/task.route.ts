import { Router } from "express";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller";

const router = Router();

router.route('/').get(getTasks).post(createTask)
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

export default router;