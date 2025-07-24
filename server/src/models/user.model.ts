import mongoose, { Document, Schema, Model } from "mongoose";
import { passwordEncrypt } from "../utils/common";

const userSchema: Schema<IUser> = new Schema({

  password: {
    type: String,
    required: true,
    set: passwordEncrypt,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPassToken: String,
  resetPassExpiresAt: Date,
  verificationToken: {
    type: String,
    default: () => Math.floor(100000 + Math.random() * 900000).toString()  // 6 digit code
  },
  verificationTokenExpiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
  },
  // KYC fields
  user_type: String,
  first_name: String,
  last_name: String,
  phone_number: String,
  dob: String,
  id_type: String,
  id_number: String,
  country: String,
  location: String,
  id_front: String,
  id_back: String,
  profession: String,
  father_name: String,
  mother_name: String,
  witness_name: String,
  witness_relation: String,
  user_age: String,
  gender: String,
  marital_status: String,
  religion: String,
  medication: {
    type: Boolean,
    default: false,
  },
  medication_type: String,
  childrens: {
    type: Number,
    default: 0,
  },
  boys: {
    type: Number,
    default: 0,
  },
  girls: {
    type: Number,
    default: 0,
  },
  banks: String,
  doc: String,
  date_joined: {
    type: Date,
    default: Date.now,
  },
  profile_pic: String
}, {
  collection: 'users',
  timestamps: true
});


const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;

export interface IUser extends Document {
  password: string;
  email: string;
  lastLogin?: Date;
  isVerified: boolean;
  resetPassToken?: string;
  resetPassExpiresAt?: Date;
  verificationToken: string;
  verificationTokenExpiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  // KYC fields
  user_type?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  dob?: string;
  id_type?: string;
  id_number?: string;
  country?: string;
  location?: string;
  id_front?: string;
  id_back?: string;
  profession?: string;
  father_name?: string;
  mother_name?: string;
  witness_name?: string;
  witness_relation?: string;
  user_age?: string;
  gender?: string;
  marital_status?: string;
  religion?: string;
  medication?: boolean;
  medication_type?: string;
  childrens?: number;
  boys?: number;
  girls?: number;
  banks?: string;
  doc?: string;
  date_joined?: Date;
  profile_pic?: string;
}
