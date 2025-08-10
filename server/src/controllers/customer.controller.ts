import { Request, Response } from 'express';
import Customer from "../models/customer.model";
import { CustomError, getImageUrl, s3 } from "../utils/common";
import type { File as MulterFile } from 'multer';
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import env from '../configs/env';
import crypto from 'crypto';
import sharp from 'sharp';


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

    if (!result) throw new CustomError("No Customers found", 404);

    for (const customer of result) {
        if (customer.profile_pic) {
            customer.profile_pic = await getImageUrl(customer.profile_pic);
        }
    }

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
    if (req.file && req.file.size > 0 && req.file.buffer) {
        const randomSuffix = crypto.randomBytes(8).toString('hex');
        const fileName = `profile_pics/${randomSuffix}_${req.file.originalname}`;

        const buffer = await sharp(req.file.buffer).resize({ height: 90, width: 90, fit: 'contain' }).toBuffer();

        const params = {
            Bucket: env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: req.file.mimetype
        };
        const command = new PutObjectCommand(params)

        await s3.send(command);

        data.profile_pic = fileName
    }

    const result = await Customer.create(data);

    if (!result) throw new CustomError("Failed to create Customer", 500, true);

    res.send({
        success: true,
        result,
    });
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Customer.findById(id);

    if (result.profile_pic) {
        result.profile_pic = await getImageUrl(result.profile_pic);
    }

    if (!result) throw new CustomError("Customer not found", 404);


    res.status(200).send({
        success: true,
        result,
    });
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Customer.findByIdAndUpdate(
        id,
        { $set: req.body },
        {
            new: true,
            runValidators: true,
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

    const customer = await Customer.findById(id);
    if (!customer) throw new CustomError("Customer not found", 404);

    const result = await Customer.deleteOne({ _id: id });

    if (!result.deletedCount) throw new CustomError("Customer not found or already deleted.", 404, true);

    const params = {
        Bucket: env.AWS_BUCKET_NAME,
        Key: customer.profile_pic,
    }

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    res.status(result.deletedCount ? 204 : 404).send({
        success: !!result.deletedCount,
        result
    });
};

export const multiDeleteCustomers = async (req: Request, res: Response): Promise<void> => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        throw new CustomError("Invalid or empty 'ids' array", 400);
    }

    const customers = await Customer.find({ _id: { $in: ids } });

    if (customers.length === 0) {
        throw new CustomError("No customers found for the provided IDs", 404);
    }

    const deletePromises = customers.map(customer => {
        const params = {
            Bucket: env.AWS_BUCKET_NAME,
            Key: customer.profile_pic,
        };
        const command = new DeleteObjectCommand(params);
        return s3.send(command);
    });

    await Promise.all(deletePromises);

    const result = await Customer.deleteMany({ _id: { $in: ids } });

    if (!result) throw new CustomError("Failed to delete customers", 500);


    res.status(result.deletedCount ? 204 : 404).send({
        success: true,
        result,
    });
};
