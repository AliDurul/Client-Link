import mongoose, { Document, Schema, Model } from "mongoose";

export interface AsignAgent {
    id: string;
    name: string;
    email?: string;
}

const taskSchema: Schema<ITask> = new Schema({
    title: {
        type: String,
        required: true,
    },
    asign_agent: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true,
        enum: ['High', 'Medium', 'Low',]
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled']
    }
}, {
    collection: 'Tasks',
    timestamps: true
});

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
export default Task;

export interface ITask extends Document {
    id: number;
    title: string;
    asign_agent: AsignAgent;
    description: string;
    priority: string;
    status: string;
    created_at: Date;
}
