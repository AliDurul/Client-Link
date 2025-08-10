"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.createTask = exports.getTasks = exports.getCountDetail = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const common_1 = require("../utils/common");
const getCountDetail = async (req, res) => {
    const result = await task_model_1.default.aggregate([
        {
            $facet: {
                totalCount: [
                    { $count: "count" } // Count all documents
                ],
                statusCounts: [
                    {
                        $group: {
                            _id: "$status", // Group by status field
                            count: { $sum: 1 } // Count documents in each group
                        }
                    }
                ],
                priorityCounts: [
                    {
                        $group: {
                            _id: "$priority", // Group by priority field
                            count: { $sum: 1 } // Count documents in each group
                        }
                    }
                ]
            }
        }
    ]);
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
    data.statusCounts.forEach((item) => {
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
    data.priorityCounts.forEach((item) => {
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
exports.getCountDetail = getCountDetail;
const getTasks = async (req, res) => {
    const result = await res.getModelList(task_model_1.default, {}, [{
            path: 'assigned_agent',
            select: 'name email profile_pic first_name last_name phone_number'
        }]);
    for (const task of result) {
        if (task.assigned_agent?.profile_pic) {
            task.assigned_agent.profile_pic = await (0, common_1.getImageUrl)(task.assigned_agent.profile_pic);
        }
    }
    res.send({
        success: true,
        details: await res.getModelListDetails(task_model_1.default),
        result,
    });
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    const result = await task_model_1.default.create(req.body);
    if (!result)
        throw new common_1.CustomError("Failed to create FAQ", 500);
    res.send({
        success: true,
        result,
    });
};
exports.createTask = createTask;
const getTaskById = async (req, res) => {
    const { id } = req.params;
    const result = await task_model_1.default.findById(id);
    if (!result)
        throw new common_1.CustomError("Task not found", 404);
    res.status(200).send({
        success: true,
        result,
    });
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res) => {
    const { id } = req.params;
    const result = await task_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
    if (!result)
        throw new common_1.CustomError("Task not found", 404);
    res.status(201).send({
        success: true,
        result
    });
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const { id } = req.params;
    const data = await task_model_1.default.deleteOne({ _id: id });
    if (!data.deletedCount)
        throw new common_1.CustomError("Task not found or already deleted.", 404, true);
    res.status(data.deletedCount ? 204 : 404).send({
        success: data.deletedCount,
        data
    });
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=task.controller.js.map