import mongoose, { Document, Schema, Model } from "mongoose";
import { passwordEncrypt } from "../utils/common";

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  AGENT: 'agent',
  MODERATOR: 'moderator'
} as const;

const userSchema: Schema<IUser> = new Schema({
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
    set: passwordEncrypt,
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
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.AGENT,
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


const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;


export interface IUser extends Document {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: 'admin' | 'manager' | 'employee' | 'moderator' | 'agent';
  department?: string;
  employee_id: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login?: Date;
  is_verified: boolean;
  reset_pass_token?: string;
  reset_pass_expires_at?: Date;
  verification_token?: string;
  verification_token_expires_at?: Date;
  profile_pic?: string;
  date_joined: Date;
  permissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  full_name?: string;
}