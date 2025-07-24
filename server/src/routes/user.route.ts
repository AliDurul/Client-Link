import { Router } from "express";
import { deleteUser, getUserById, getUsers, updateUser } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default router;