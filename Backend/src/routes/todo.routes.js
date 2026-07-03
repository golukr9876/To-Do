import { Router } from "express";
import { createToDo, deleteToDo, getTodo, isDone, readToDo, updateToDo } from "../controllers/todo.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";





const router = Router();

router.route('/').post(verifyToken, createToDo);
router.route('/').get(verifyToken, readToDo);
router.route('/:id').get(verifyToken, getTodo)
router.route('/:id').put(verifyToken, updateToDo);
router.route('/:id/done').patch(verifyToken, isDone);
router.route("/:id").delete(verifyToken, deleteToDo);


export default router;