"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoice = exports.updateInvoice = exports.getInvoiceById = exports.createInvoice = exports.getInvoices = void 0;
const invoice_model_1 = __importDefault(require("../models/invoice.model"));
const common_1 = require("../utils/common");
const product_model_1 = __importDefault(require("../models/product.model"));
const getInvoices = async (req, res) => {
    const result = await res.getModelList(invoice_model_1.default, {}, [
        { path: 'creator', select: '_id first_name last_name full_name email profile_pic phone_number' },
        { path: 'customer', select: '_id first_name last_name full_name email profile_pic phone_number' },
        { path: 'invoice_items.product', select: '_id name' }
    ]);
    if (!result)
        throw new common_1.CustomError("No Invoices found", 404, true);
    // If the customer has a profile_pic, generate a signed URL for it
    for (const invoice of result) {
        // @ts-expect-error
        if (invoice.customer?.profile_pic) {
            // @ts-expect-error
            invoice.customer.profile_pic = await (0, common_1.getImageUrl)(invoice.customer.profile_pic);
        }
        // @ts-expect-error
        if (invoice.creator?.profile_pic) {
            // @ts-expect-error
            invoice.creator.profile_pic = await (0, common_1.getImageUrl)(invoice.creator.profile_pic);
        }
    }
    console.log(result);
    res.send({
        success: true,
        details: await res.getModelListDetails(invoice_model_1.default),
        result,
    });
};
exports.getInvoices = getInvoices;
const createInvoice = async (req, res) => {
    const creator = req.user?.id;
    req.body.creator = creator;
    if (!req.body.invoice_items?.length) {
        throw new common_1.CustomError("Invoice items are required", 400);
    }
    (0, common_1.validateFutureDate)(req.body.due_date, "Due date");
    const productIds = req.body.invoice_items.map((item) => item.product._id);
    const products = await product_model_1.default.find({
        _id: { $in: productIds },
        is_active: true
    }).select('_id price').lean();
    if (products.length !== productIds.length) {
        throw new common_1.CustomError("One or more products not found", 404);
    }
    const productMap = new Map(products.map(p => [p._id.toString(), p]));
    const processedItems = req.body.invoice_items.map((item) => {
        const product = productMap.get(item.product._id.toString());
        if (!product) {
            throw new common_1.CustomError(`Product ${item.product._id} not found`, 404, true);
        }
        const quantity = item.quantity || 1;
        const discount = item.discount || 0;
        const unit_price = product.price;
        const total_price = (quantity * unit_price) - discount;
        if (total_price < 0) {
            throw new common_1.CustomError(`Total price cannot be negative for product ${item.product._id}`, 400, true);
        }
        return {
            product: item.product,
            quantity,
            unit_price,
            total_price,
            discount
        };
    });
    // Calculate invoice totals
    const subtotal = processedItems.reduce((sum, item) => sum + item.total_price, 0);
    const tax_percentage = req.body.tax || 16;
    const tax_amount = subtotal * (tax_percentage / 100);
    const shipping_cost = req.body.shipping_cost || 0;
    const invoice_discount = req.body.discount || 0;
    const total_amount = subtotal + shipping_cost - invoice_discount + tax_amount;
    const invoiceData = {
        ...req.body,
        invoice_items: processedItems,
        subtotal,
        tax_percentage,
        tax_amount,
        shipping_cost,
        discount: invoice_discount,
        total_amount
    };
    const result = await invoice_model_1.default.create(invoiceData);
    if (!result)
        throw new common_1.CustomError("Failed to create Invoice", 500);
    res.send({
        success: true,
        result,
    });
};
exports.createInvoice = createInvoice;
const getInvoiceById = async (req, res) => {
    const { id } = req.params;
    const result = await (await invoice_model_1.default.findById(id)).populate([
        { path: 'creator', select: '_id first_name last_name full_name email profile_pic phone_number' },
        { path: 'customer', select: '_id first_name last_name full_name email profile_pic phone_number' },
        { path: 'invoice_items.product', select: '_id name' }
    ]);
    if (!result)
        throw new common_1.CustomError("Invoice not found", 404);
    res.status(200).send({
        success: true,
        result,
    });
};
exports.getInvoiceById = getInvoiceById;
const updateInvoice = async (req, res) => {
    const { id } = req.params;
    // If invoice_items are being updated, recalculate everything
    if (req.body.invoice_items?.length) {
        const productIds = req.body.invoice_items.map((item) => item.product._id);
        const products = await product_model_1.default.find({
            _id: { $in: productIds },
            is_active: true
        }).select('_id price').lean();
        if (products.length !== productIds.length) {
            throw new common_1.CustomError("One or more products not found", 404);
        }
        const productMap = new Map(products.map(p => [p._id.toString(), p]));
        const processedItems = req.body.invoice_items.map((item) => {
            const product = productMap.get(item.product._id.toString());
            if (!product) {
                throw new common_1.CustomError(`Product ${item.product._id} not found`, 404);
            }
            const quantity = item.quantity || 1;
            const discount = item.discount || 0;
            const unit_price = product.price;
            const total_price = (quantity * unit_price) - discount;
            return {
                product: item.product._id,
                quantity,
                unit_price,
                total_price,
                discount
            };
        });
        // Recalculate totals
        const subtotal = processedItems.reduce((sum, item) => sum + item.total_price, 0);
        const tax_percentage = req.body.tax_percentage || 16;
        const tax_amount = subtotal * (tax_percentage / 100);
        const shipping_cost = req.body.shipping_cost || 0;
        const invoice_discount = req.body.discount || 0;
        const total_amount = subtotal + shipping_cost - invoice_discount + tax_amount;
        req.body = {
            ...req.body,
            invoice_items: processedItems,
            subtotal,
            tax_percentage,
            tax_amount,
            total_amount
        };
    }
    if (req.body.due_date) {
        (0, common_1.validateFutureDate)(req.body.due_date, "Due date");
    }
    const result = await invoice_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
    if (!result)
        throw new common_1.CustomError("Invoice not found", 404);
    res.status(201).send({
        success: true,
        result
    });
};
exports.updateInvoice = updateInvoice;
const deleteInvoice = async (req, res) => {
    const { id } = req.params;
    const data = await invoice_model_1.default.deleteOne({ _id: id });
    if (!data.deletedCount)
        throw new common_1.CustomError("Invoice not found or already deleted.", 404, true);
    res.status(data.deletedCount ? 204 : 404).send({
        success: data.deletedCount,
        data
    });
};
exports.deleteInvoice = deleteInvoice;
//# sourceMappingURL=invoice.controller.js.map