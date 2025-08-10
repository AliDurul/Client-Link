"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../controllers/customer.controller");
const common_1 = require("../utils/common");
const router = (0, express_1.Router)();
router.route("/")
    .get(customer_controller_1.getCustomers)
    .post(common_1.upload.single("profile_pic"), customer_controller_1.createCustomer)
    .delete(customer_controller_1.multiDeleteCustomers);
router.route('/:id')
    .get(customer_controller_1.getCustomerById)
    .put(common_1.upload.single("profile_pic"), customer_controller_1.updateCustomer)
    .delete(customer_controller_1.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customer.route.js.map