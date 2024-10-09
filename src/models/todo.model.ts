import { model, Schema, Document } from 'mongoose';
import userModel from './users.model';
import option from '@/utils/option';
import { ToDo } from '@/interfaces/toDo.interface';

const toDoSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: userModel,
            required: true
        },
        date: {
            type: Date,
            default: ''
        },
        title: {
            type: String,
            required: true
        },
        completionStatus: {
            type: Number, //1=completed, 0=incomplete
            min: [0, 'invalid status'], max: [1, 'invalid status'],
            default: 0
        }
    },
    option
)

const toDoModel = model<Document & ToDo>('Todo', toDoSchema);

export default toDoModel;