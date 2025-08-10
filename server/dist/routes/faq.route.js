"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faq_controller_1 = require("../controllers/faq.controller");
const router = (0, express_1.Router)();
router.route('/').get(faq_controller_1.getFaqs).post(faq_controller_1.createFaq);
router.route('/:id').get(faq_controller_1.getFaqById).put(faq_controller_1.updateFaq).delete(faq_controller_1.deleteFaq);
exports.default = router;
//# sourceMappingURL=faq.route.js.map