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
exports.USER_ROLES = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const common_1 = require("../utils/common");
exports.USER_ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
    AGENT: 'agent',
    MODERATOR: 'moderator'
};
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        set: common_1.passwordEncrypt,
        select: false,
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
    phone_number: {
        type: String,
        trim: true,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'],
    },
    role: {
        type: String,
        enum: Object.values(exports.USER_ROLES),
        default: exports.USER_ROLES.AGENT,
    },
    department: {
        type: String,
        trim: true,
    },
    employee_id: {
        type: String,
        default: `EMP-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
    },
    last_login: {
        type: Date,
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    reset_pass_token: {
        type: String,
        select: false,
    },
    reset_pass_expires_at: {
        type: Date,
        select: false,
    },
    verification_token: {
        type: String,
        default: () => Math.floor(100000 + Math.random() * 900000).toString(),
        select: false,
    },
    verification_token_expires_at: {
        type: Date,
        default: () => new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
        select: false,
    },
    profile_pic: {
        type: String,
        trim: true,
    },
    date_joined: {
        type: Date,
        default: Date.now,
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
    collection: 'users',
    timestamps: true,
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map