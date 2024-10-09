import option from '@/utils/option';
import { model, Schema, Document } from 'mongoose';
import { Category } from '@/interfaces/category.interface';

const categorySchema: Schema = new Schema(
    {
        categoryName: {
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

const categoryModel = model<Document & Category>('Category', categorySchema)

export default categoryModel;