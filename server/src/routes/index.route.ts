import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import faqRoutes from "./faq.route";
import taskRoutes from "./task.route";

const router = Router();

// authRoutes
router.use('/auth', authRoutes);

// userRoutes
router.use("/users", userRoutes);

// faqRoutes
router.use("/faqs", faqRoutes);

// taskRoutes
router.use("/tasks", taskRoutes);

export default router;