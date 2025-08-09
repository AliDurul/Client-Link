import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from "../models/product.model";

import { CustomError } from "../utils/common";



export const getProducts = async (req: Request, res: Response): Promise<void> => {

    const result = await res.getModelList(Product);
    
    res.send({
        success: true,
        details: await res.getModelListDetails(Product),
        result,
    });
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {

    const result = await Product.create(req.body);

    if (!result) throw new CustomError("Failed to create FAQ", 500);

    res.send({
        success: true,
        result,
    });
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Product.findById(id);

    if (!result) throw new CustomError("Product not found", 404);

    res.status(200).send({
        success: true,
        result,
    });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Product.findByIdAndUpdate<IProduct>(id, req.body, { new: true });

    if (!result) throw new CustomError("Product not found", 404);

    res.status(201).send({
        success: true,
        result
    });

};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const data = await Product.deleteOne({ _id: id })

    if (!data.deletedCount) throw new CustomError("Product not found or already deleted.", 404, true);

    res.status(data.deletedCount ? 204 : 404).send({
        success: data.deletedCount,
        data
    })

};

