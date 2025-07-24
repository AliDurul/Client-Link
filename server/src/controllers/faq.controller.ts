import { Request, Response, NextFunction } from 'express';
import Faq, { IFaq } from "../models/faq.model";

import { CustomError } from "../utils/common";


export const getFaqs = async (req: Request, res: Response): Promise<void> => {

    const result = await res.getModelList(Faq)

    res.send({
        success: true,
        details: await res.getModelListDetails(Faq),
        result,
    });
};

export const createFaq = async (req: Request, res: Response): Promise<void> => {

    const result = await Faq.create(req.body);

    if(!result) throw new CustomError("Failed to create FAQ", 500);

    res.send({
        success: true,
        result,
    });
};

export const getFaqById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Faq.findById(id);

    if (!result) throw new CustomError("Faq not found", 404);

    res.status(200).send({
        success: true,
        result,
    });
};

export const updateFaq = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Faq.findByIdAndUpdate<IFaq>(id, req.body, { new: true });

    if (!result) throw new CustomError("Faq not found", 404);

    res.status(201).send({
        success: true,
        result
    });

};

export const deleteFaq = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const data = await Faq.deleteOne({ _id: id })

    if (!data.deletedCount) throw new CustomError("Faq not found or already deleted.", 404, true);

    res.status(data.deletedCount ? 204 : 404).send({
        success: data.deletedCount,
        data
    })

};

