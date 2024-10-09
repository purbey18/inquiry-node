import { ObjectId } from "mongoose";
export interface Inquiry {
    _id: string;
    userId: string;
    partyName: string;
    companyName: string;
    contactNumber: number;
    email: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    date: Date;
    sourceId: ObjectId;
    sourceName: String;
    person: String;
    personId: ObjectId;
    requirements: [{
        requirementId: ObjectId
        requirement: String,
        units: String
    }],
    stepStatus: string;
    inquiryStatus: [{
        stepStatus: string,
        remark: string,
        date: Date,
        status: number
    }]
    status: number;
    moreThanOneThousandUnits: boolean;
}

