import mongoose, { Document, Schema, Model } from "mongoose";



const customerSchema: Schema<ICustomer> = new Schema({
    customer_id: {
        type: String,
        // required: true,
        trim: true,
    },
    first_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone_number: {
        type: String,
        required: true,
        trim: true,
        index: true,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'],
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        lowercase: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
    },
    id_type: {
        type: String,
        enum: ['passport', 'national_id', 'driving_license', 'other'],
    },
    id_number: {
        type: String,
        trim: true,
    },
    id_front: {
        type: String,
        trim: true,
    },
    id_back: {
        type: String,
        trim: true,
    },
    profession: {
        type: String,
        trim: true,
    },
    marital_status: {
        type: String,
        enum: ['single', 'married', 'divorced', 'widowed', 'other'],
        lowercase: true,
    },
    religion: {
        type: String,
        trim: true,
    },
    father_name: {
        type: String,
        trim: true,
    },
    mother_name: {
        type: String,
        trim: true,
    },
    witness_name: {
        type: String,
        trim: true,
    },
    witness_relation: {
        type: String,
        trim: true,
    },
    medication: {
        type: Boolean,
        default: false,
    },
    medication_type: {
        type: String,
        trim: true,
    },
    number_of_children: {
        type: Number,
        default: 0,
        min: [0, 'Number of children cannot be negative'],
    },
    boys: {
        type: Number,
        default: 0,
        min: [0, 'Number of boys cannot be negative'],
    },
    girls: {
        type: Number,
        default: 0,
        min: [0, 'Number of girls cannot be negative'],
    },
    bank_details: {
        type: String,
        trim: true,
    },
    documents: [{
        type: String,
        trim: true,
    }],
    profile_pic: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blacklisted'],
        default: 'active',
    },
    notes: {
        type: String,
        trim: true,
    },
    assigned_agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    collection: 'customers',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

customerSchema.virtual('full_name').get(function () {
    return `${this.first_name} ${this.last_name}`.trim();
});

customerSchema.pre('save', function (next) {
    if (this.boys + this.girls !== this.number_of_children && this.number_of_children > 0) {
        this.number_of_children = this.boys + this.girls;
    }
    next();
});


const Customer: Model<ICustomer> = mongoose.model<ICustomer>('Customer', customerSchema);
export default Customer;


export interface ICustomer extends Document {
    customer_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone_number: string;
    dob?: Date;
    gender?: 'male' | 'female' | 'other';
    address: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
    };
    id_type?: 'passport' | 'national_id' | 'driving_license' | 'other';
    id_number?: string;
    id_front?: string;
    id_back?: string;
    profession?: string;
    marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
    religion?: string;
    father_name?: string;
    mother_name?: string;
    witness_name?: string;
    witness_relation?: string;
    medication?: boolean;
    medication_type?: string;
    number_of_children?: number;
    boys?: number;
    girls?: number;
    bank_details?: string;
    documents?: string[];
    profile_pic?: string;
    status: 'active' | 'inactive' | 'blacklisted';
    notes?: string;
    assigned_agent?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    fullName?: string;
}