import { Request, Response, NextFunction } from 'express';
import Task, { ITask } from "../models/task.model";

import { CustomError } from "../utils/common";


export const getTasks = async (req: Request, res: Response): Promise<void> => {

    const result = await res.getModelList(Task, {}, [{
        path: 'asign_agent',
        select: 'name email profile_pic first_name last_name phone_number'
    }])
    
    res.send({
        success: true,
        details: await res.getModelListDetails(Task),
        result,
    });
};

export const createTask = async (req: Request, res: Response): Promise<void> => {

    const result = await Task.create(req.body);

    if (!result) throw new CustomError("Failed to create FAQ", 500);

    res.send({
        success: true,
        result,
    });
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Task.findById(id);

    if (!result) throw new CustomError("Task not found", 404);

    res.status(200).send({
        success: true,
        result,
    });
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await Task.findByIdAndUpdate<ITask>(id, req.body, { new: true });

    if (!result) throw new CustomError("Task not found", 404);

    res.status(201).send({
        success: true,
        result
    });

};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const data = await Task.deleteOne({ _id: id })

    if (!data.deletedCount) throw new CustomError("Task not found or already deleted.", 404, true);

    res.status(data.deletedCount ? 204 : 404).send({
        success: data.deletedCount,
        data
    })

};

