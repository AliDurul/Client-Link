import { Request, Response, NextFunction } from 'express';
import Customer, { ICustomer } from "../models/customer.model";
import { CustomError } from "../utils/common";

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
    const result = await res.getModelList(Customer);

    res.send({
        success: true,
        details: await res.getModelListDetails(Customer),
        result,
    });
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {

    const result = await Customer.create(req.body);

    if (!result) throw new CustomError("Failed to create Customer", 500);

    res.send({
        success: true,
        result,
    });
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log('get customer by id:', id);

    const result = await Customer.findById(id);

    if (!result) throw new CustomError("Customer not found", 404);

    res.status(200).send({
        success: true,
        result,
    });
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, verificationToken, resetPassToken, ...updateData } = req.body;

    const result = await Customer.findByIdAndUpdate(
        id,
        { $set: updateData }, // Use $set to ensure new fields are added
        {
            new: true,
            runValidators: true, // Run schema validations
            strict: false // Allow new fields to be added
        }
    );

    if (!result) throw new CustomError("Customer not found", 404);

    res.status(200).send({
        success: true,
        result
    });
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const data = await Customer.deleteOne({ _id: id });

    if (!data.deletedCount) throw new CustomError("Customer not found or already deleted.", 404, true);

    res.status(data.deletedCount ? 204 : 404).send({
        success: !!data.deletedCount,
        data
    });
};
