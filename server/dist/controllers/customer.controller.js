"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiDeleteCustomers = exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.createCustomer = exports.getCustomers = void 0;
const customer_model_1 = __importDefault(require("../models/customer.model"));
const common_1 = require("../utils/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = __importDefault(require("../configs/env"));
const crypto_1 = __importDefault(require("crypto"));
const sharp_1 = __importDefault(require("sharp"));
const getCustomers = async (req, res) => {
    const result = await res.getModelList(customer_model_1.default);
    if (!result)
        throw new common_1.CustomError("No Customers found", 404);
    for (const customer of result) {
        if (customer.profile_pic) {
            customer.profile_pic = await (0, common_1.getImageUrl)(customer.profile_pic);
        }
    }
    res.send({
        success: true,
        details: await res.getModelListDetails(customer_model_1.default),
        result,
    });
};
exports.getCustomers = getCustomers;
const createCustomer = async (req, res) => {
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
    if (data.boys)
        data.boys = Number(data.boys);
    if (data.girls)
        data.girls = Number(data.girls);
    if (data.number_of_children)
        data.number_of_children = Number(data.number_of_children);
    // Convert boolean fields
    if (data.medication)
        data.medication = data.medication === "true" || data.medication === true;
    // Attach file if present
    if (req.file && req.file.size > 0 && req.file.buffer) {
        const randomSuffix = crypto_1.default.randomBytes(8).toString('hex');
        const fileName = `profile_pics/${randomSuffix}_${req.file.originalname}`;
        const buffer = await (0, sharp_1.default)(req.file.buffer).resize({ height: 90, width: 90, fit: 'contain' }).toBuffer();
        const params = {
            Bucket: env_1.default.AWS_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: req.file.mimetype
        };
        const command = new client_s3_1.PutObjectCommand(params);
        await common_1.s3.send(command);
        data.profile_pic = fileName;
    }
    const result = await customer_model_1.default.create(data);
    if (!result)
        throw new common_1.CustomError("Failed to create Customer", 500, true);
    res.send({
        success: true,
        result,
    });
};
exports.createCustomer = createCustomer;
const getCustomerById = async (req, res) => {
    const { id } = req.params;
    const result = await customer_model_1.default.findById(id);
    if (result.profile_pic) {
        result.profile_pic = await (0, common_1.getImageUrl)(result.profile_pic);
    }
    if (!result)
        throw new common_1.CustomError("Customer not found", 404);
    res.status(200).send({
        success: true,
        result,
    });
};
exports.getCustomerById = getCustomerById;
const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const result = await customer_model_1.default.findByIdAndUpdate(id, { $set: req.body }, {
        new: true,
        runValidators: true,
    });
    if (!result)
        throw new common_1.CustomError("Customer not found", 404);
    res.status(200).send({
        success: true,
        result
    });
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    const customer = await customer_model_1.default.findById(id);
    if (!customer)
        throw new common_1.CustomError("Customer not found", 404);
    const result = await customer_model_1.default.deleteOne({ _id: id });
    if (!result.deletedCount)
        throw new common_1.CustomError("Customer not found or already deleted.", 404, true);
    const params = {
        Bucket: env_1.default.AWS_BUCKET_NAME,
        Key: customer.profile_pic,
    };
    const command = new client_s3_1.DeleteObjectCommand(params);
    await common_1.s3.send(command);
    res.status(result.deletedCount ? 204 : 404).send({
        success: !!result.deletedCount,
        result
    });
};
exports.deleteCustomer = deleteCustomer;
const multiDeleteCustomers = async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new common_1.CustomError("Invalid or empty 'ids' array", 400);
    }
    const customers = await customer_model_1.default.find({ _id: { $in: ids } });
    if (customers.length === 0) {
        throw new common_1.CustomError("No customers found for the provided IDs", 404);
    }
    const deletePromises = customers.map(customer => {
        const params = {
            Bucket: env_1.default.AWS_BUCKET_NAME,
            Key: customer.profile_pic,
        };
        const command = new client_s3_1.DeleteObjectCommand(params);
        return common_1.s3.send(command);
    });
    await Promise.all(deletePromises);
    const result = await customer_model_1.default.deleteMany({ _id: { $in: ids } });
    if (!result)
        throw new common_1.CustomError("Failed to delete customers", 500);
    res.status(result.deletedCount ? 204 : 404).send({
        success: true,
        result,
    });
};
exports.multiDeleteCustomers = multiDeleteCustomers;
//# sourceMappingURL=customer.controller.js.map