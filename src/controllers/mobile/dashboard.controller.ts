import DashboardService from "@/services/dashboard.services";
import catchErrorHandler from "@middlewares/error.middleware";
import { NextFunction, Response } from 'express';
import { codes, message } from "@/utils/messages";
import { RequestWithUser } from "@/interfaces/auth.interface";
import moment from "moment";
import response from "@/utils/response";

export class DashboardController {
    public dashboardServices = new DashboardService()

    public getDashboardData = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const id = req.user._id
            const inquiryData = await this.dashboardServices.getAllInquiries(id)
            const newInquiries = inquiryData.filter((item => item.stepStatus == 'new'))
            const contactedInquiries = inquiryData.filter((item => item.stepStatus == 'contacted'))
            const workingInquiries = inquiryData.filter((item => item.stepStatus == 'working'))
            const wonInquiries = inquiryData.filter((item => item.stepStatus == 'won'))
            const lostInquiries = inquiryData.filter((item => item.stepStatus == 'lost'))

            let data = {
                totolInquiries: inquiryData.length,
                newInquiries: newInquiries.length,
                contactedInquiries: contactedInquiries.length,
                workingInquiries: workingInquiries.length,
                wonInquiries: wonInquiries.length,
                lostInquiries: lostInquiries.length
            }
            return res.send(response.success_response(codes.success.ok, message.inquiry.fetchAllInquiries, data))
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public getDashboardChartData = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            let { startDate, endDate } = req.body
            const query = { $and: [] };
            query['$and'].push({ $or: [{ userId: req.user._id }, { personId: req.user._id }] });
            if(startDate && endDate){
                query['$and'].push({
                    createdAt: {
                        $gte: moment(startDate, 'DD-MM-YYYY').startOf('day'),
                        $lte: moment(endDate, 'DD-MM-YYYY').endOf('day')
                    }
                });
            }

            const chartData = await this.dashboardServices.getDashboardChartData(query)
            const newInquiries = chartData.filter((item => item.stepStatus == 'new'))
            const contactedInquiries = chartData.filter((item => item.stepStatus == 'contacted'))
            const workingInquiries = chartData.filter((item => item.stepStatus == 'working'))
            const wonInquiries = chartData.filter((item => item.stepStatus == 'won'))
            const lostInquiries = chartData.filter((item => item.stepStatus == 'lost'))

            let data = {
                totolInquiries: chartData.length,
                newInquiries: newInquiries.length,
                contactedInquiries: contactedInquiries.length,
                workingInquiries: workingInquiries.length,
                wonInquiries: wonInquiries.length,
                lostInquiries: lostInquiries.length
            }
            return res.send(response.success_response(codes.success.ok, message.inquiry.fetchAllInquiries, data))

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}

export default DashboardController