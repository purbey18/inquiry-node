import moment from "moment";
import response from "@utils/response"
import InquiryService from "@/services/inquiry.services";
import catchErrorHandler from "@middlewares/error.middleware";
import { NextFunction, Response } from 'express';
import { message, codes } from "@/utils/messages";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { UserService } from "@/services/auth.services";
export class InquiryController {
    public inquiryService = new InquiryService()
    public userServie = new UserService()

    public allInquiries = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { page, limit, startDate, endDate, stepStatus } = req.body
            const skip: any = page * limit - limit;
            const query = { $and: [] };
            const checkUserPosition = await this.userServie.getUserData(req.user._id)
            if (checkUserPosition.position_id == 1) {
                query['$and'].push({})
            } else {
                query['$and'].push({ $or: [{ userId: req.user._id }, { personId: req.user._id }] });
            }

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

            const allInquiryData = await this.inquiryService.listAllInquiries(query, parseInt(skip), parseInt(limit));
            if (allInquiryData) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.fetchAllInquiries, allInquiryData.allInquiries))
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

    public addNewInquiry = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.body,
                userId: req.user._id,
            }

            if (!req.body.person) {
                data.person = req.user._id
            }

            const newInquiry = await this.inquiryService.addNewinquiry(data)
            if (newInquiry) {
                return res.send(response.success_response(codes.success.ok, message.inquiry.inquiryCreated, newInquiry))
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

    public changeStatus = async (req: RequestWithUser, res: Response, next: NextFunction) => {
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
}

export default InquiryController