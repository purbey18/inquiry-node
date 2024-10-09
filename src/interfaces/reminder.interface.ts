export interface Reminder{
    _id:string;
    userId:string;
    inquiryId:string;
    title:string;
    date: Date;
    time: Date;
    description:string;
    status:number;
}