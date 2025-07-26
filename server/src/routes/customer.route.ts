import { Router } from "express";
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from "../controllers/customer.controller";


const router = Router();

router.route("/").get(getCustomers).post(createCustomer); 
router.route('/:id').get(getCustomerById).put(updateCustomer).delete(deleteCustomer);

export default router;