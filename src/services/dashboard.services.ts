import { HttpException } from "@/exceptions/HttpException";
import { codes, message } from "@/utils/messages";
import inquiryModel from "@/models/inquiry.model";
import userModel from "@/models/users.model";

export class DashboardService {
    public Inquiry = inquiryModel
    public User = userModel
    public async getAllInquiries(id: any) {
        const inquiries = await this.Inquiry.find({ $or: [{ userId: id }, { personId: id }] }).lean()
        if (inquiries) {
            return inquiries
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async getAllInquiriesForAdmin() {
        const users = await this.User.find().lean()
        const inquiries = await this.Inquiry.find().lean()
        if (inquiries) {
            return { inquiries, users }
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async getDashboardChartData(query: any) {
        const data = await this.Inquiry.find(query).lean()
        if (data) {
            return data
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }
}
export default DashboardService
