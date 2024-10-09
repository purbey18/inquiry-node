import option from '@/utils/option';
import { model, Schema, Document } from 'mongoose';
import { Notification } from '@/interfaces/notification.interface';
import userModel from './users.model';

const notificationSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: userModel,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['Inquiry', 'Todo', 'Reminder', 'Advertisement', 'General'],
            required: true
        },
        data: {
            type: Object,
            default: {}
        },
        status: {
            type: Number, //0=Unread, 1=Read
            min: [0, 'invalid status'],
            max: [1, 'invalid status'],
            default: 0,
        }
    },
    option
)

const NotificationModel = model<Document & Notification>('Notification', notificationSchema)

export default NotificationModel;