"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.createProduct = exports.getProducts = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const common_1 = require("../utils/common");
const getProducts = async (req, res) => {
    const result = await res.getModelList(product_model_1.default);
    res.send({
        success: true,
        details: await res.getModelListDetails(product_model_1.default),
        result,
    });
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
    const result = await product_model_1.default.create(req.body);
    if (!result)
        throw new common_1.CustomError("Failed to create FAQ", 500);
    res.send({
        success: true,
        result,
    });
};
exports.createProduct = createProduct;
const getProductById = async (req, res) => {
    const { id } = req.params;
    const result = await product_model_1.default.findById(id);
    if (!result)
        throw new common_1.CustomError("Product not found", 404);
    res.status(200).send({
        success: true,
        result,
    });
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const result = await product_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
    if (!result)
        throw new common_1.CustomError("Product not found", 404);
    res.status(201).send({
        success: true,
        result
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const data = await product_model_1.default.deleteOne({ _id: id });
    if (!data.deletedCount)
        throw new common_1.CustomError("Product not found or already deleted.", 404, true);
    res.status(data.deletedCount ? 204 : 404).send({
        success: data.deletedCount,
        data
    });
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.controller.js.map