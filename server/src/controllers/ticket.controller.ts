import { Request, Response, NextFunction } from 'express';
import Ticket, { TicCat } from "../models/ticket.model";

import { CustomError } from "../utils/common";


export const getTickets = async (req: Request, res: Response): Promise<void> => {

    const result = await res.getModelList(Ticket)

    res.send({
        success: true,
        details: await res.getModelListDetails(Ticket),
        result,
    });
};

export const createTicket = async (req: Request, res: Response): Promise<void> => {


    const userId = req.user?.id;

    req.body.assigned_agent = userId;
    console.log(req.body);

    const result = await Ticket.create(req.body);

    if (!result) throw new CustomError("Failed to create FAQ", 500);

    res.send({
        success: true,
        result,
    });
};

export const getTicketById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Ticket.findById(id);

    if (!result) throw new CustomError("Ticket not found", 404);

    res.status(200).send({
        success: true,
        result,
    });
};

export const updateTicket = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Ticket.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) throw new CustomError("Ticket not found", 404);

    res.status(201).send({
        success: true,
        result
    });

};

export const deleteTicket = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const data = await Ticket.deleteOne({ _id: id })

    if (!data.deletedCount) throw new CustomError("Ticket not found or already deleted.", 404, true);

    res.status(data.deletedCount ? 204 : 404).send({
        success: data.deletedCount,
        data
    })

};

// --------------- TICKET CATEGORIES ---------------
export const getTicCats = async (req: Request, res: Response): Promise<void> => {

    const result = await res.getModelList(TicCat)

    res.send({
        success: true,
        details: await res.getModelListDetails(TicCat),
        result,
    });
};

export const createTicCat = async (req: Request, res: Response): Promise<void> => {


    const userId = req.user?._id;

    req.body.assigned_agent = userId;

    const result = await TicCat.create(req.body);

    if (!result) throw new CustomError("Failed to create FAQ", 500);

    res.send({
        success: true,
        result,
    });
};

export const getTicCatById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await TicCat.findById(id);

    if (!result) throw new CustomError("TicCat not found", 404);

    res.status(200).send({
        success: true,
        result,
    });
};

export const updateTicCat = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await TicCat.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) throw new CustomError("TicCat not found", 404);

    res.status(201).send({
        success: true,
        result
    });

};

export const deleteTicCat = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const data = await TicCat.deleteOne({ _id: id })

    if (!data.deletedCount) throw new CustomError("TicCat not found or already deleted.", 404, true);

    res.status(data.deletedCount ? 204 : 404).send({
        success: data.deletedCount,
        data
    })

};