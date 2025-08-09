import { Router } from "express";
import { createTicCat, createTicket, deleteTicCat, deleteTicket, getTicCatById, getTicCats, getTicketById, getTickets, updateTicCat, updateTicket } from "../controllers/ticket.controller";

const router = Router();

// Ticket Categories
router.route('/categories').get(getTicCats).post(createTicCat);
router.route('/categories/:id').get(getTicCatById).put(updateTicCat).delete(deleteTicCat);

router.route('/').get(getTickets).post(createTicket)
router.route('/:id').get(getTicketById).put(updateTicket).delete(deleteTicket);



export default router;