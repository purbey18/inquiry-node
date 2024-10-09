import { model, Schema, Document } from 'mongoose';
import inquiryModel from './inquiry.model';
import userModel from './users.model';
import option from '@/utils/option';
import { Reminder } from '@/interfaces/reminder.interface';

const reminderSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: userModel,
            required: true
        },
        inquiryId: {
            type: Schema.Types.ObjectId,
            ref: inquiryModel,
        },
        title: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: ''
        },
        time: {
            type: String,
            default: ''
        },
        description: {
            type: String,
        },
        status: {
            type: Number, //0=Inactive, 1=Active
            min: [0, 'invalid status'],
            max: [1, 'invalid status'],
            default: 1,
        },
    },
    option
);

const reminderModel = model<Document & Reminder>('Reminder', reminderSchema);

export default reminderModel;