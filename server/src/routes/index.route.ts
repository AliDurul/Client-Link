import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import faqRoutes from "./faq.route";
import taskRoutes from "./task.route";
import customerRoutes from "./customer.route";
import invoiceRoutes from "./invoice.route";
import productRoutes from "./product.route";

const router = Router();

// authRoutes
router.use('/auth', authRoutes);

// userRoutes
router.use("/users", userRoutes);

// customerRoutes
router.use("/customers", customerRoutes);

// faqRoutes
router.use("/faqs", faqRoutes);

// taskRoutes
router.use("/tasks", taskRoutes);

// invoiceRoutes
router.use("/invoices", invoiceRoutes);

// productRoutes
router.use("/products", productRoutes);

export default router;