import option from '@/utils/option';
import { model, Schema, Document } from 'mongoose';
import { Message } from '@/interfaces/message.interface';
import userModel from './users.model';

const messageSchema: Schema = new Schema(
     {
        message: {
            type: String,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: userModel,
        },
        roomId: {
            type: String,
            required: true
        },
        messageType: {
            type: String,
        },
    },
    option
)

const MessageModel = model<Document & Message>('Message', messageSchema)

export default MessageModel;