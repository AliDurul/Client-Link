import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import faqRoutes from "./faq.route";

const router = Router();

// authRoutes
router.use('/auth', authRoutes);

// userRoutes
router.use("/users", userRoutes);

// faqRoutes
router.use("/faqs", faqRoutes);

export default router;