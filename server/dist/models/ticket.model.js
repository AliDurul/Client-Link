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
exports.TicCat = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const escalationSchema = new mongoose_1.Schema({
    raised_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
}, { _id: false, timestamps: true });
const ticketSchema = new mongoose_1.Schema({
    assigned_agent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TicCat',
        required: true,
    },
    caller_details: {
        first_name: {
            type: String,
            trim: true,
        },
        last_name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            // required: true,
            trim: true,
        },
        phone_number: {
            type: String,
            trim: true,
        },
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'resolved', 'cancelled', 'escalated'],
        default: 'pending',
        required: true,
    },
    email_id: {
        type: String,
        default: null,
        trim: true,
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low', 'critical'],
        default: 'medium',
    },
    flag: {
        type: String,
        default: 'moderate',
        enum: ['important', 'moderate', 'least important', 'prank'],
    },
    escalation: {
        type: escalationSchema,
        default: null, // Added default null
    },
}, {
    timestamps: true,
    collection: 'tickets',
});
const Ticket = mongoose_1.default.model('Ticket', ticketSchema);
exports.default = Ticket;
// --------------------------------------------------------------
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    collection: 'tic-cats',
    timestamps: true
});
exports.TicCat = mongoose_1.default.model('TicCat', categorySchema);
//# sourceMappingURL=ticket.model.js.map