import { model, Schema, Document } from 'mongoose';
import { Requirement } from '@/interfaces/requirement.interface';
import option from '@/utils/option';
import userModel from './users.model';
import categoryModel from './category.model';

const requirementSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: userModel,
            required: true
        },
        requirement: {
            type: String,
            required: true
        },
        perUnitPrice: {
            type: Number,
            // required: true
        },
        units: {
            type: String,
            required: true
        },
        status: {
            type: Number, //0=Inactive, 1=Active
            min: [0, 'invalid status'],
            max: [1, 'invalid status'],
            default: 1,
        },
    },
    option
)

const requirementModel = model<Document & Requirement>('Requirements', requirementSchema)
export default requirementModel