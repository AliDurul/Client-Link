import { Router } from "express";
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from "../controllers/customer.controller";
import { upload } from "../utils/common";

const router = Router();

router.route("/")
    .get(getCustomers)
    .post(upload.single("profile_pic"), createCustomer);
router.route('/:id').get(getCustomerById).put(updateCustomer).delete(deleteCustomer);

export default router;