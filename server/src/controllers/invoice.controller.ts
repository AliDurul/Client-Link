import { Request, Response, NextFunction } from 'express';
import Invoice, { IInvoice } from "../models/invoice.model";

import { CustomError } from "../utils/common";
import Product from '../models/product.model';



export const getInvoices = async (req: Request, res: Response): Promise<void> => {

    const result = await res.getModelList(Invoice, {}, [
        { path: 'creator', select: '_id first_name last_name full_name email profile_pic phone_number' },
        { path: 'customer', select: '_id first_name last_name full_name email profile_pic phone_number' },
        { path: 'invoice_items.product', select: '_id name' }
    ])

    res.send({
        success: true,
        details: await res.getModelListDetails(Invoice),
        result,
    });
};

export const createInvoice = async (req: Request, res: Response): Promise<void> => {

    const creator = req.user?.id
    req.body.creator = creator;

    if (!req.body.invoice_items?.length) {
        throw new CustomError("Invoice items are required", 400);
    }

    const productIds = req.body.invoice_items.map((item: any) => item.product);
    const products = await Product.find({
        _id: { $in: productIds },
        is_active: true
    }).select('_id price').lean();

    if (products.length !== productIds.length) {
        throw new CustomError("One or more products not found", 404);
    }

    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    const processedItems = req.body.invoice_items.map((item: any) => {
        const product = productMap.get(item.product.toString());

        if (!product) {
            throw new CustomError(`Product ${item.product} not found`, 404);
        }

        return {
            product: item.product,
            quantity: item.quantity,
            unit_price: product.price
        };
    });

    req.body.invoice_items = processedItems;

    const result = await Invoice.create(req.body);

    if (!result) throw new CustomError("Failed to create Invoice", 500);

    res.send({
        success: true,
        result,
    });
};

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await (await Invoice.findById(id)).populate([
        { path: 'creator', select: '_id first_name last_name full_name email profile_pic phone_number' },
        { path: 'customer', select: '_id first_name last_name full_name email profile_pic phone_number' },
        { path: 'invoice_items.product', select: '_id name' }
    ]);

    if (!result) throw new CustomError("Invoice not found", 404);

    res.status(200).send({
        success: true,
        result,
    });
};

export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Invoice.findByIdAndUpdate<IInvoice>(id, req.body, { new: true });

    if (!result) throw new CustomError("Invoice not found", 404);

    res.status(201).send({
        success: true,
        result
    });

};

export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const data = await Invoice.deleteOne({ _id: id })

    if (!data.deletedCount) throw new CustomError("Invoice not found or already deleted.", 404, true);

    res.status(data.deletedCount ? 204 : 404).send({
        success: data.deletedCount,
        data
    })

};

