"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const common_1 = require("../utils/common");
const getUsers = async (req, res) => {
    const result = await res.getModelList(user_model_1.default);
    res.send({
        success: true,
        details: await res.getModelListDetails(user_model_1.default),
        result,
    });
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const { id } = req.params;
    const result = await user_model_1.default.findById(id);
    if (!result)
        throw new common_1.CustomError("User not found", 404);
    res.status(200).send({
        success: true,
        result,
    });
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const { id } = req.params;
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, verificationToken, resetPassToken, ...updateData } = req.body;
    const result = await user_model_1.default.findByIdAndUpdate(id, { $set: updateData }, // Use $set to ensure new fields are added
    {
        new: true,
        runValidators: true, // Run schema validations
        strict: false // Allow new fields to be added
    });
    if (!result)
        throw new common_1.CustomError("User not found", 404);
    res.status(200).send({
        success: true,
        result
    });
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const data = await user_model_1.default.deleteOne({ _id: id });
    if (!data.deletedCount)
        throw new common_1.CustomError("User not found or already deleted.", 404, true);
    res.status(data.deletedCount ? 204 : 404).send({
        success: !!data.deletedCount,
        data
    });
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map