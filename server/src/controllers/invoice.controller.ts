import { Request, Response } from 'express';
import Invoice, { IInvoice, IInvoiceItem } from "../models/invoice.model";

import { CustomError, getImageUrl, validateFutureDate } from "../utils/common";
import Product from '../models/product.model';



export const getInvoices = async (req: Request, res: Response): Promise<void> => {

    const result = await res.getModelList(Invoice, {}, [
        { path: 'creator', select: '_id first_name last_name full_name email profile_pic phone_number' },
        { path: 'customer', select: '_id first_name last_name full_name email profile_pic phone_number' },
        { path: 'invoice_items.product', select: '_id name' }
    ])

    if (!result) throw new CustomError("No Invoices found", 404, true);

    // If the customer has a profile_pic, generate a signed URL for it
    for (const invoice of result) {
        // @ts-expect-error
        if (invoice.customer?.profile_pic) {
            // @ts-expect-error
            invoice.customer.profile_pic = await getImageUrl(invoice.customer.profile_pic);
        }

        // @ts-expect-error
        if (invoice.creator?.profile_pic) {
            // @ts-expect-error
            invoice.creator.profile_pic = await getImageUrl(invoice.creator.profile_pic);
        }
    }
    console.log(result);
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

    validateFutureDate(req.body.due_date, "Due date");

    const productIds = req.body.invoice_items.map((item: any) => item.product._id);
    const products = await Product.find({
        _id: { $in: productIds },
        is_active: true
    }).select('_id price').lean();

    if (products.length !== productIds.length) {
        throw new CustomError("One or more products not found", 404);
    }

    const productMap = new Map(products.map(p => [p._id.toString(), p]));
    const processedItems = req.body.invoice_items.map((item: any) => {
        const product = productMap.get(item.product._id.toString());

        if (!product) {
            throw new CustomError(`Product ${item.product._id} not found`, 404, true);
        }

        const quantity = item.quantity || 1;
        const discount = item.discount || 0;
        const unit_price = product.price;
        const total_price = (quantity * unit_price) - discount;

        if (total_price < 0) {
            throw new CustomError(`Total price cannot be negative for product ${item.product._id}`, 400, true);
        }

        return {
            product: item.product,
            quantity,
            unit_price,
            total_price,
            discount
        };
    });

    // Calculate invoice totals
    const subtotal = processedItems.reduce((sum: number, item: IInvoiceItem) => sum + item.total_price, 0);
    const tax_percentage = req.body.tax || 16;
    const tax_amount = subtotal * (tax_percentage / 100);
    const shipping_cost = req.body.shipping_cost || 0;
    const invoice_discount = req.body.discount || 0;
    const total_amount = subtotal + shipping_cost - invoice_discount + tax_amount;

    const invoiceData = {
        ...req.body,
        invoice_items: processedItems,
        subtotal,
        tax_percentage,
        tax_amount,
        shipping_cost,
        discount: invoice_discount,
        total_amount
    };

    const result = await Invoice.create(invoiceData);

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

    // If invoice_items are being updated, recalculate everything
    if (req.body.invoice_items?.length) {
        const productIds = req.body.invoice_items.map((item: any) => item.product._id);
        const products = await Product.find({
            _id: { $in: productIds },
            is_active: true
        }).select('_id price').lean();

        if (products.length !== productIds.length) {
            throw new CustomError("One or more products not found", 404);
        }

        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        const processedItems = req.body.invoice_items.map((item: any) => {
            const product = productMap.get(item.product._id.toString());

            if (!product) {
                throw new CustomError(`Product ${item.product._id} not found`, 404);
            }

            const quantity = item.quantity || 1;
            const discount = item.discount || 0;
            const unit_price = product.price;
            const total_price = (quantity * unit_price) - discount;

            return {
                product: item.product._id,
                quantity,
                unit_price,
                total_price,
                discount
            };
        });

        // Recalculate totals
        const subtotal = processedItems.reduce((sum: number, item: IInvoiceItem) => sum + item.total_price, 0);
        const tax_percentage = req.body.tax_percentage || 16;
        const tax_amount = subtotal * (tax_percentage / 100);
        const shipping_cost = req.body.shipping_cost || 0;
        const invoice_discount = req.body.discount || 0;
        const total_amount = subtotal + shipping_cost - invoice_discount + tax_amount;

        req.body = {
            ...req.body,
            invoice_items: processedItems,
            subtotal,
            tax_percentage,
            tax_amount,
            total_amount
        };
    }

    if (req.body.due_date) {
        validateFutureDate(req.body.due_date, "Due date");
    }

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

