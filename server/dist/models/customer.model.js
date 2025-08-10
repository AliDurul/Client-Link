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
const customerSchema = new mongoose_1.Schema({
    customer_id: {
        type: String,
        default: () => `CUST-${Date.now()}`,
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
    nationality: {
        type: String,
        trim: true,
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
        zip_code: String,
    },
    id_type: {
        type: String,
        enum: ['passport', 'nrc', 'license'],
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
    // medication: {//
    //     type: Boolean,
    //     default: false,
    // },
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
    finincial_institution: {
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    full_name: {
        type: String,
        default: function () {
            return `${this.first_name} ${this.last_name}`.trim();
        },
        transform: function () {
            return `${this.first_name} ${this.last_name}`.trim();
        },
    },
}, {
    collection: 'customers',
    timestamps: true,
});
customerSchema.pre('save', function (next) {
    if (this.boys + this.girls !== this.number_of_children && this.number_of_children > 0) {
        this.number_of_children = this.boys + this.girls;
    }
    next();
});
const Customer = mongoose_1.default.model('Customer', customerSchema);
exports.default = Customer;
//# sourceMappingURL=customer.model.js.map