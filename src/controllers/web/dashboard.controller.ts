import DashboardService from "@/services/dashboard.services";
import catchErrorHandler from "@middlewares/error.middleware";
import { NextFunction, Response } from 'express';
import { codes, message } from "@/utils/messages";
import { RequestWithUser } from "@/interfaces/auth.interface";
import response from "@/utils/response";
import moment from "moment";

export class WebDashboardController {
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

    public getAdminDashboardData = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const inquiryData = await this.dashboardServices.getAllInquiriesForAdmin()
            const newInquiries = inquiryData.inquiries.filter((item => item.stepStatus == 'new'))
            const contactedInquiries = inquiryData.inquiries.filter((item => item.stepStatus == 'contacted'))
            const workingInquiries = inquiryData.inquiries.filter((item => item.stepStatus == 'working'))
            const wonInquiries = inquiryData.inquiries.filter((item => item.stepStatus == 'won'))
            const lostInquiries = inquiryData.inquiries.filter((item => item.stepStatus == 'lost'))

            let data = {
                totalUsers: inquiryData.users.length,
                totolInquiries: inquiryData.inquiries.length,
                newInquiries: newInquiries.length,
                contactedInquiries: contactedInquiries.length,
                workingInquiries: workingInquiries.length,
                wonInquiries: wonInquiries.length,
                lostInquiries: lostInquiries.length,
            }
            return res.send(response.success_response(codes.success.ok, message.inquiry.fetchAllInquiries, data))

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public getDashboardChartData = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const date = new Date().setMonth(new Date().getMonth())
            const query = {
                $or: [{ userId: req.user._id }, { personId: req.user._id }],
                date: {
                    $gte: moment(date).startOf('month'),
                    $lte: moment(date).endOf('month'),
                }
            }
            const inquiryData = await this.dashboardServices.getDashboardChartData(query)
            let stepStatus = ["total", "new", "contacted", "working", "won", "lost"]
            const datasets = [];
            for (let i = 0; i < stepStatus.length; i++) {
                const startDate = moment(date).startOf('month')
                const endDate = moment(date).endOf('month')
                let data = []
                let obj = {
                    label: `${stepStatus[i]} inquiries`
                }
                if (i == 0) {
                    for (let j = startDate; j <= endDate; j.add(1, 'days')) {
                        let total = inquiryData.filter((item => {
                            return moment(item.date).format('l') == j.format('l')
                        }))
                        data.push(total ? total.length : 0)
                    }

                } else {
                    let inquiries = inquiryData.filter((item => item.stepStatus == stepStatus[i]))
                    for (let j = startDate; j <= endDate; j.add(1, 'days')) {
                        let total = inquiries.filter((item => {
                            return moment(item.date).format('l') == j.format('l')
                        }))
                        data.push(total ? total.length : 0)
                    }
                }
                obj['data'] = data
                datasets.push(obj)
            }
            return res.send(response.success_response(codes.success.ok, message.inquiry.fetchAllInquiries, datasets))
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}

export default WebDashboardController