import { model , Schema, Document} from 'mongoose';
import option from '@/utils/option';
import userModel from './users.model';
import { Source } from '@/interfaces/source.interface';

const sourceSchema = new Schema(
    {
        userId : {
            type: Schema.Types.ObjectId,
            ref: userModel,
            required: true
        },
        sourceName: {
            type: String,
            required: true
        },
        status: {
            type: Number, //0=Inactive, 1=Active
            min: [0, 'invalid status'],
            max: [1, 'invalid status'],
            default: 1,
        }
    },
    option
)

const sourceModel = model<Document & Source>('Source' , sourceSchema)

export default sourceModel;