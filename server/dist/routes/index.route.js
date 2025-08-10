"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("./user.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const faq_route_1 = __importDefault(require("./faq.route"));
const task_route_1 = __importDefault(require("./task.route"));
const customer_route_1 = __importDefault(require("./customer.route"));
const invoice_route_1 = __importDefault(require("./invoice.route"));
const product_route_1 = __importDefault(require("./product.route"));
const ticket_route_1 = __importDefault(require("./ticket.route"));
const router = (0, express_1.Router)();
// authRoutes
router.use('/auth', auth_route_1.default);
// userRoutes
router.use("/users", user_route_1.default);
// customerRoutes
router.use("/customers", customer_route_1.default);
// faqRoutes
router.use("/faqs", faq_route_1.default);
// taskRoutes
router.use("/tasks", task_route_1.default);
// invoiceRoutes
router.use("/invoices", invoice_route_1.default);
// productRoutes
router.use("/products", product_route_1.default);
// ticketRoutes
router.use("/tickets", ticket_route_1.default);
exports.default = router;
//# sourceMappingURL=index.route.js.map