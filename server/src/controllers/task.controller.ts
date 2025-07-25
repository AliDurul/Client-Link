import { Request, Response, NextFunction } from 'express';
import Task, { ITask } from "../models/task.model";

import { CustomError } from "../utils/common";


export const getCountDetail = async (req: Request, res: Response): Promise<void> => {
    const result = await Task.aggregate([
        {
            $facet: {
                totalCount: [
                    { $count: "count" }  // Count all documents
                ],
                statusCounts: [
                    {
                        $group: {
                            _id: "$status",      // Group by status field
                            count: { $sum: 1 }   // Count documents in each group
                        }
                    }
                ],
                priorityCounts: [
                    {
                        $group: {
                            _id: "$priority",    // Group by priority field
                            count: { $sum: 1 }   // Count documents in each group
                        }
                    }
                ]
            }
        }
    ]);

    console.log("Raw aggregation result:", result);


    const data = result[0];

    // Format the response

    const statusCounts = {
        pending: 0,
        'in-progress': 0,
        completed: 0,
        cancelled: 0,
        all: data.totalCount[0]?.count || 0
    };

    const priorityCounts = {
        high: 0,
        medium: 0,
        low: 0
    };

    // Map status counts
    data.statusCounts.forEach((item: any) => {
        switch (item._id) {
            case 'Pending':
                statusCounts.pending = item.count;
                break;
            case 'In-Progress':
                statusCounts['in-progress'] = item.count;
                break;
            case 'Completed':
                statusCounts.completed = item.count;
                break;
            case 'Cancelled':
                statusCounts.cancelled = item.count;
                break;
        }
    });

    // Map priority counts
    data.priorityCounts.forEach((item: any) => {
        switch (item._id) {
            case 'High':
                priorityCounts.high = item.count;
                break;
            case 'Medium':
                priorityCounts.medium = item.count;
                break;
            case 'Low':
                priorityCounts.low = item.count;
                break;
        }
    });

    res.send({
        success: true,
        count: {
            status: statusCounts,
            priority: priorityCounts
        }
    });
};

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

