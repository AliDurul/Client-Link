import { Router } from "express";
import { createFaq, deleteFaq, getFaqById, getFaqs, updateFaq } from "../controllers/faq.controller";

const router = Router();

router.route('/').get(getFaqs).post(createFaq)
router.route('/:id').get(getFaqById).put(updateFaq).delete(deleteFaq);

export default router;