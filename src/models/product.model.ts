import { model, Schema, Document } from 'mongoose';
import { Product } from '@/interfaces/product.interface';
import option from '@/utils/option';
import categoryModel from './category.model';
import userModel from './users.model';

const productSchema: Schema = new Schema(
    {
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: categoryModel,
            // required: true
        },
        productName: {
            type: String,
            required: true
        },
        perUnitPrice: {
            type: Number,
            // required: true
        },
        units: {
            type: Number,
            // required: true
        },
        status: {
            type: Number, //0=Inactive, 1=Active
            min: [0, 'invalid status'],
            max: [1, 'invalid status'],
            default: 1,
        },
        attachPhotos: {
            type: [String],
            default: []
        }
    },
    option
)

const productModel = model<Document & Product>('Products', productSchema)
export default productModel