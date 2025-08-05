import { Router } from "express";
import { createInvoice, deleteInvoice, getInvoiceById, getInvoices, updateInvoice } from "../controllers/invoice.controller";

const router = Router();

router.route('/').get(getInvoices).post(createInvoice)
router.route('/:id').get(getInvoiceById).put(updateInvoice).delete(deleteInvoice);

export default router;