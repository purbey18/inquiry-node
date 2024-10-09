import { model, Schema, Document } from 'mongoose';
import { Inquiry } from '@/interfaces/inquiry.interface';
import option from '@/utils/option';
import userModel from './users.model';
import requirementModel from './requirement.model';

let obj = [
    {
        stepStatus: 'contacted',
        remark: '',
        date: '',
        status: 0
    },
    {
        stepStatus: 'working',
        remark: '',
        date: '',
        status: 0
    },
    {
        stepStatus: 'won',
        remark: '',
        date: '',
        status: 0
    },
    {
        stepStatus: 'lost',
        remark: '',
        date: '',
        status: 0
    },
]

const inquirySchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: userModel,
            required: true
        },
        partyName: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            default: ''
        },
        contactNumber: {
            type: Number,
            required: true,
            default: ''
        },
        email: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: '',
        },
        pinCode: {
            type: Number,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            default: '',
        },
        country: {
            type: String,
            default: '',
        },
        sourceId: {
            type: String,
            default: ''
        },
        source: {
            type: String,
        },
        date: {
            type: Date,
            default: ''
        },
        person: {
            type: String,
            default: ''
        },
        personId: {
            type: Schema.Types.ObjectId,
            ref: userModel,
        },
        requirements: [{
            requirementId: {
                type: Schema.Types.ObjectId,
                ref: requirementModel,
                required: true
            },
            requirement: String,
            units: String
        }],
        stepStatus: {
            type: String,
            enum: ["new", "contacted", "working", "won", "lost"],
            default: 'new',
            required: true,
        },
        remark: {
            type: String,
            default: ''
        },
        discountOnrequirement: {
            type: Array,
        },
        userComment:{
            type: String,
            default: ''
        },
        productionUserComment:{
            type: String,
            default: ''
        },
        inquiryStatus: {
            type: Array,
            maxLength: 4,
            default: obj,
            required: true,
        },
        isRead: {
            type: Number, //0=Unread, 1=Read
            min: [0, 'invalid status'],
            max: [1, 'invalid status'],
            default: 0,
        },
        status: {
            type: Number, //0=Inactive, 1=Active
            min: [0, 'invalid status'],
            max: [1, 'invalid status'],
            default: 1,
        },
        moreThanOneThousandUnits:{
            type: Boolean,
            default: false
        },
    },
    option
);

const inquiryModel = model<Document & Inquiry>('Inquiry', inquirySchema);

export default inquiryModel;