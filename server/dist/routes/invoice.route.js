"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_controller_1 = require("../controllers/invoice.controller");
const router = (0, express_1.Router)();
router.route('/').get(invoice_controller_1.getInvoices).post(invoice_controller_1.createInvoice);
router.route('/:id').get(invoice_controller_1.getInvoiceById).put(invoice_controller_1.updateInvoice).delete(invoice_controller_1.deleteInvoice);
exports.default = router;
//# sourceMappingURL=invoice.route.js.map