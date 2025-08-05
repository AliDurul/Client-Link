import mongoose, { Document, Schema, Model } from "mongoose";

const productSchema: Schema<IProduct> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
    },

    stock_quantity: {
        type: Number,
        default: 0,
        min: [0, 'Stock quantity cannot be negative'],
    },

    category: {
        type: String,
        // required: true,
        default: 'general',
    },
    
    is_active: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    collection: 'products'
});

export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    stock_quantity: number;
    category: string;
    is_active: boolean;
}

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;