import { Request, Response, NextFunction } from 'express';
import Customer, { ICustomer } from "../models/customer.model";
import { CustomError } from "../utils/common";
import type { File as MulterFile } from 'multer';

// Extend Express Request interface to include 'file' property
declare global {
    namespace Express {
        interface Request {
            file?: MulterFile;
        }
    }
}

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
    const result = await res.getModelList(Customer);

    res.send({
        success: true,
        details: await res.getModelListDetails(Customer),
        result,
    });
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
    // Convert to plain object
    const data = { ...req.body };

    // Transform address fields into nested object
    data.address = {
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        zip_code: data.zip_code,
    };

    // Remove flat address fields from root
    delete data.street;
    delete data.city;
    delete data.state;
    delete data.country;
    delete data.zip_code;

    // Convert number fields
    if (data.boys) data.boys = Number(data.boys);
    if (data.girls) data.girls = Number(data.girls);
    if (data.number_of_children) data.number_of_children = Number(data.number_of_children);

    // Convert boolean fields
    if (data.medication) data.medication = data.medication === "true" || data.medication === true;

    // Attach file if present
    if (req.file) {
        data.profile_pic = req.file.filename;
    }

    const result = await Customer.create(data);

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
