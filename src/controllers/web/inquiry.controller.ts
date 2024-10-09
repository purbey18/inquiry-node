import moment from "moment";
import response from "@utils/response"
import InquiryService from "@/services/inquiry.services";
import catchErrorHandler from "@middlewares/error.middleware";
import { NextFunction, Request, Response } from 'express';
import { message, codes } from "@/utils/messages";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { fireNotification } from "@/controllers/mobile/notification.controller";
import { UserService } from "@/services/auth.services";

export class WebInquiryController {
    public inquiryService = new InquiryService()
    public userServie = new UserService()
    public notification = new fireNotification();

    public allInquiries = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { page, limit, startDate, endDate, search, userId, sourceId, stepStatus, status, isRead, below48Hours, below72Hours, isDiscountOnRequirement, moreThanOneThousandUnits } = req.body
            const skip: any = page * limit - limit;
            let sortOn: any = { createdAt: -1 }
            const query = { $and: [] };
            const checkUserPosition = await this.userServie.getUserData(req.user._id)
            if (checkUserPosition.position_id == 1 || checkUserPosition.position_id == 4) {
                query['$and'].push({})
            } else {
                query['$and'].push({ $or: [{ userId: req.user._id }, { personId: req.user._id }] });
            }
            if (status == 0 || status == 1) {
                query['$and'].push({ status: status });
            }
            if (sourceId) {
                query['$and'].push({ sourceId: sourceId });
            }
            if (userId) {
                query['$and'].push({ userId: userId });
            }
            if (stepStatus) {
                query['$and'].push({ stepStatus: stepStatus });
            }
            if (isRead == 0 || isRead == 1) {
                query['$and'].push({ isRead: isRead });
            }
            if (isDiscountOnRequirement == true) {
                query['$and'].push({ discountOnrequirement: { $gte: { $size: 0 } } });
                sortOn = { modifiedAt: -1 }
            }
            if (moreThanOneThousandUnits == true) {
                query['$and'].push({ moreThanOneThousandUnits: true });
            }
            const subQuery = { $or: [] };
            if (search) {
                subQuery['$or'].push({ stepStatus: { $regex: search, $options: 'i' } });
                subQuery['$or'].push({ partyName: { $regex: search, $options: 'i' } });
            }

            if (below48Hours) {
                let below42HoursDate = new Date(new Date().getTime() - 48 * 60 * 60 * 1000);
                let currentTime = new Date(new Date().getTime());
                query['$and'].push({
                    date: {
                        $gte: moment(below42HoursDate, 'DD-MM-YYYY'),
                        $lte: moment(currentTime, 'DD-MM-YYYY')
                    }
                });
            }

            if (below72Hours) {
                // let below42HoursDate = new Date(new Date().getTime() - 48 * 60 * 60 * 1000);
                // let bewlow72HoursDate = new Date(new Date().getTime() - 72 * 60 * 60 * 1000);
                // moment(below48HoursDate, 'DD-MM-YYYY').startOf('day')
                // moment(bewlow72HoursDate, 'DD-MM-YYYY').endOf('day')
                let currentDateAndTime = new Date();
                query['$and'].push({
                    date: {
                        $gte: moment(currentDateAndTime).subtract(72, 'hours'),
                        $lte: moment(currentDateAndTime).subtract(48, 'hours')
                    }
                });
            }

            if (startDate && endDate) {
                query['$and'].push({
                    date: {
                        $gte: moment(startDate, 'DD-MM-YYYY').startOf('day'),
                        $lte: moment(endDate, 'DD-MM-YYYY').endOf('day')
                    }
                });
            }
            if (
                typeof subQuery !== 'undefined' &&
                Object.keys(subQuery).length > 0 &&
                subQuery['$or'].length > 0
            ) {
                query['$and'].push(subQuery);
            }

            const allInquiryData = await this.inquiryService.listAllInquiries(query, parseInt(skip), parseInt(limit), sortOn);
            if (allInquiryData) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.fetchAllInquiries, allInquiryData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public addNewInquiry = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { person } = req.body
            const data = {
                ...req.body,
                userId: req.user._id,
            }
            const newInquiry = await this.inquiryService.addNewinquiry(data)
            if (newInquiry) {
                if(person){
                    await this.notification.inquiryAssignNotification(newInquiry)
                }
                return res.send(response.success_response(codes.success.ok, message.inquiry.inquiryCreated, newInquiry))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public updateInquiryDetails = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const updateDetails = await this.inquiryService.updateInquiry(data)
            if (updateDetails) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.inquiryUpdated, updateDetails))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }


    public getInquiryDetails = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const id = req.body
            let inquiryDetails = await this.inquiryService.getInquiryData(id)
            if (inquiryDetails) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.fetchAllInquiries, inquiryDetails))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public updateInquirRemark = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const updateInquiry = await this.inquiryService.updateInquiryComment(data)
            if (updateInquiry) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.inquiryUpdated, updateInquiry))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public deleteInquiry = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const inquiryData = await this.inquiryService.deleteinquiry(data)
            if (inquiryData) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.inquiryDeleted, []))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public changeInquiryStepStatus = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const inquiryData = await this.inquiryService.changeStepStatus(data)
            if (inquiryData) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.stepStatusUpdated, inquiryData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public getpartyNameList = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { search } = req.body
            const query = { $and: [] };
            if (search) {
                query['$and'].push({ partyName: { $regex: search, $options: 'i' } });
            }
            const getPartyNameList = await this.inquiryService.getAllPartyName(query)
            if (getPartyNameList) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.partNameList, getPartyNameList))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public adminListInquiryByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, startDate, endDate, stepStatus } = req.body
            const skip: any = page * limit - limit;
            let sortOn: any = { createdAt: -1 }
            const query = { $and: [] };
            query['$and'].push({ userId: req.body.userId });

            if (stepStatus) {
                query['$and'].push({ stepStatus: stepStatus });
            }
            const subQuery = { $or: [] };
            if (req.body.search) {
                subQuery['$or'].push({ stepStatus: { $regex: req.body.search, $options: 'i' } });
                subQuery['$or'].push({ partyName: { $regex: req.body.search, $options: 'i' } });
            }

            if (startDate && endDate) {
                query['$and'].push({
                    createdAt: {
                        $gte: moment(startDate, 'DD-MM-YYYY').startOf('day'),
                        $lte: moment(endDate, 'DD-MM-YYYY').endOf('day')
                    }
                });
            }
            if (
                typeof subQuery !== 'undefined' &&
                Object.keys(subQuery).length > 0 &&
                subQuery['$or'].length > 0
            ) {
                query['$and'].push(subQuery);
            }

            const allInquiryData = await this.inquiryService.listAllInquiries(query, parseInt(skip), parseInt(limit), sortOn);
            if (allInquiryData) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.fetchAllInquiries, allInquiryData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public changeStatus = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const inquiryData = await this.inquiryService.changeStatus(data);
            if (inquiryData) {
                return res.send(response.success_response(codes.success.ok, message.reminder.changeStatus, inquiryData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public discountOnRequirement = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const inquiryData = await this.inquiryService.discountOnRequirement(data);
            if (inquiryData) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.discountOnRequirements, inquiryData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public addProductionUserComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const inquiryData = await this.inquiryService.addProductionUserComment(data);
            if (inquiryData) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.commentAdded, inquiryData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}

export default WebInquiryController