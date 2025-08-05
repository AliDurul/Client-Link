import { Router } from "express";
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, multiDeleteCustomers, updateCustomer } from "../controllers/customer.controller";
import { upload } from "../utils/common";

const router = Router();

router.route("/")
    .get(getCustomers)
    .post(upload.single("profile_pic"), createCustomer)
    .delete(multiDeleteCustomers);

router.route('/:id')
    .get(getCustomerById)
    .put(upload.single("profile_pic"), updateCustomer)
    .delete(deleteCustomer);

export default router;