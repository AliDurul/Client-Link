import mongoose, { Document, Schema, Model } from "mongoose";



const invoiceItemSchema: Schema<IInvoiceItem> = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
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
    }
}, { _id: false, });

invoiceItemSchema.pre('save', function (next) {
    this.total_price = this.quantity * this.unit_price;
    next();
});

const invoiceSchema: Schema<IInvoice> = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
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
        default: 0,
        min: [0, 'Tax cannot be negative'],
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
})

invoiceSchema.pre('save', function (next) {
    // Calculate subtotal
    this.subtotal = this.invoice_items.reduce((sum: number, item: IInvoiceItem) => {
        return sum + (item.quantity * item.unit_price);
    }, 0);
    
    // Calculate total
    this.total_amount = this.subtotal + this.shipping_cost - this.discount + this.tax;

    // Update each item's total_price
    this.invoice_items.forEach((item: any) => {
        item.total_price = item.quantity * item.unit_price;
    });

    next();
});

const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
export default Invoice;



export interface IInvoice extends Document {
    creator: mongoose.Schema.Types.ObjectId;
    customer: mongoose.Schema.Types.ObjectId;
    invoice_items: IInvoiceItem[];
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'closed' | 'refunded';
    shipping_cost: number;
    discount: number;
    tax: number;
    due_date: Date;
    payment_type: 'cash' | 'credit card' | 'bank transfer' | 'paypal' | 'stripe' | 'mobile' | 'debit card' | 'cheque';
    additional_note?: string;
    subtotal: number;
    total_amount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IInvoiceItem {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    unit_price: number;
    total_price: number;
}