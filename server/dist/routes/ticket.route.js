"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_controller_1 = require("../controllers/ticket.controller");
const router = (0, express_1.Router)();
// Ticket Categories
router.route('/categories').get(ticket_controller_1.getTicCats).post(ticket_controller_1.createTicCat);
router.route('/categories/:id').get(ticket_controller_1.getTicCatById).put(ticket_controller_1.updateTicCat).delete(ticket_controller_1.deleteTicCat);
router.route('/').get(ticket_controller_1.getTickets).post(ticket_controller_1.createTicket);
router.route('/:id').get(ticket_controller_1.getTicketById).put(ticket_controller_1.updateTicket).delete(ticket_controller_1.deleteTicket);
exports.default = router;
//# sourceMappingURL=ticket.route.js.map