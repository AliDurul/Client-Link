"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const invoiceItemSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    unit_price: {
        type: Number,
        required: true,
        min: [0, 'Unit price cannot be negative'],
    },
    total_price: {
        type: Number,
        min: [0, 'Total price cannot be negative'],
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
    },
}, { _id: false, });
const invoiceSchema = new mongoose_1.Schema({
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    invoice_items: [invoiceItemSchema],
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'overdue', 'closed', 'refunded'],
        default: 'draft',
    },
    shipping_cost: {
        type: Number,
        default: 0,
        min: [0, 'Shipping cost cannot be negative'],
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
    },
    tax: {
        type: Number,
        default: 16,
        min: [0, 'Tax cannot be negative'],
        max: [100, 'Tax cannot exceed 100%'],
    },
    due_date: {
        type: Date,
        required: true,
    },
    payment_type: {
        type: String,
        enum: ['cash', 'credit card', 'bank transfer', 'paypal', 'stripe', 'mobile', 'debit card', 'cheque'],
        default: 'cash',
    },
    additional_note: {
        type: String,
        trim: true,
    },
    subtotal: {
        type: Number,
        min: [0, 'Subtotal cannot be negative'],
    },
    total_amount: {
        type: Number,
        min: [0, 'Total amount cannot be negative'],
    }
}, {
    timestamps: true,
    collection: 'invoices',
});
const Invoice = mongoose_1.default.model('Invoice', invoiceSchema);
exports.default = Invoice;
//# sourceMappingURL=invoice.model.js.map