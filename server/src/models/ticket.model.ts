import mongoose, { Document, Schema, Model } from "mongoose";



const escalationSchema: Schema<IEscalation> = new Schema({
    raised_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },

}, { _id: false, timestamps: true });

const ticketSchema: Schema<ITicket> = new Schema({
    assigned_agent: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },


    category: {
        type: Schema.Types.ObjectId,
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
        default: null,
    },

}, {
    timestamps: true,
    collection: 'tickets',
});


const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
export default Ticket;

// Interface for escalation subdocument
export interface IEscalation {
    raised_by: mongoose.Schema.Types.ObjectId;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}

// Interface for caller details subdocument
export interface ICallerDetails {
    first_name: string;
    last_name: string;
    email?: string;
    phone_number: string;
}

// Main ticket interface
export interface ITicket extends Document {
    assigned_agent: mongoose.Schema.Types.ObjectId;
    customer: mongoose.Schema.Types.ObjectId;
    caller_details: ICallerDetails;
    title: string;
    description: string;
    status: 'pending' | 'active' | 'resolved' | 'cancelled' | 'escalated';
    email_id: string | null;
    priority: 'high' | 'medium' | 'low' | 'critical';
    flag: string;
    category: mongoose.Schema.Types.ObjectId;
    escalation?: IEscalation;
    createdAt: Date;
    updatedAt: Date;
}

// --------------------------------------------------------------

const categorySchema: Schema<ITicCat> = new Schema({

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


export const TicCat: Model<ITicCat> = mongoose.model<ITicCat>('TicCat', categorySchema);


export interface ITicCat extends Document {
    name: string;
    description: string;
}
