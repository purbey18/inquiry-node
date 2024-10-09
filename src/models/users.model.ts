import { model, Schema, Document } from 'mongoose';
import option from '@/utils/option';
import { User } from '@/interfaces/users.interface';

const userSchema: Schema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    position_id: {
      type: Number, // 1=Admin, 2=Manager 3=Staff.
      min: [1, 'invalid user type'], max: [3, 'invalid user type'],
      required: true,
    },
    userType: {
      type: String,
      enum: ['Admin', 'Manager', 'Staff'],
      trim: true,
    },
    device_token: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: Number, //0=Inactive, 1=Active
      min: [0, 'invalid status'],
      max: [1, 'invalid status'],
      default: 1,
    },
    remark: {
      type: String,
      default: '',
    },
  },
  option
);

const userModel = model<Document & User>('User', userSchema);

export default userModel;
