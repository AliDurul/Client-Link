"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaq = exports.updateFaq = exports.getFaqById = exports.createFaq = exports.getFaqs = void 0;
const faq_model_1 = __importDefault(require("../models/faq.model"));
const common_1 = require("../utils/common");
const getFaqs = async (req, res) => {
    const result = await res.getModelList(faq_model_1.default);
    res.send({
        success: true,
        details: await res.getModelListDetails(faq_model_1.default),
        result,
    });
};
exports.getFaqs = getFaqs;
const createFaq = async (req, res) => {
    const result = await faq_model_1.default.create(req.body);
    if (!result)
        throw new common_1.CustomError("Failed to create FAQ", 500);
    res.send({
        success: true,
        result,
    });
};
exports.createFaq = createFaq;
const getFaqById = async (req, res) => {
    const { id } = req.params;
    const result = await faq_model_1.default.findById(id);
    if (!result)
        throw new common_1.CustomError("Faq not found", 404);
    res.status(200).send({
        success: true,
        result,
    });
};
exports.getFaqById = getFaqById;
const updateFaq = async (req, res) => {
    const { id } = req.params;
    const result = await faq_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
    if (!result)
        throw new common_1.CustomError("Faq not found", 404);
    res.status(201).send({
        success: true,
        result
    });
};
exports.updateFaq = updateFaq;
const deleteFaq = async (req, res) => {
    const { id } = req.params;
    const data = await faq_model_1.default.deleteOne({ _id: id });
    if (!data.deletedCount)
        throw new common_1.CustomError("Faq not found or already deleted.", 404, true);
    res.status(data.deletedCount ? 204 : 404).send({
        success: data.deletedCount,
        data
    });
};
exports.deleteFaq = deleteFaq;
//# sourceMappingURL=faq.controller.js.map