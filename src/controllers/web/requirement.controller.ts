import { RequestWithUser } from "@/interfaces/auth.interface";
import { UserService } from "@/services/auth.services";
import { RequirementService } from "@/services/requirement.services";
import { codes, message } from "@/utils/messages";
import { NextFunction, Response } from "express";
import catchErrorHandler from "@/middlewares/error.middleware";
import response from "@/utils/response";
export class WebRequirementController {
    public requirementService = new RequirementService();
    public userService = new UserService();

    public allRequirements = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.body
            const skip: any = page * limit - limit;
            const loggedInUserId = req.user._id
            const productionUserData = await this.userService.getProductionUserData()
            const query = { $and: [] };
            query['$and'].push({ userId: { $in: [productionUserData._id, loggedInUserId] } });

            const subQuery = { $or: [] };
            if (req.body.search) {
                subQuery['$or'].push({ requirement: { $regex: req.body.search, $options: 'i' } });
            }
            if (
                typeof subQuery !== 'undefined' &&
                Object.keys(subQuery).length > 0 &&
                subQuery['$or'].length > 0
            ) {
                query['$and'].push(subQuery);
            }

            const allrequirementData = await this.requirementService.listAllRequirement(query, parseInt(skip), parseInt(limit));
            if (allrequirementData) {
                return res.send(response.success_response(codes.success.ok, message.requirements.fetchAllrequirement, allrequirementData))
            }
        }
        catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public getUserRequirements = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.body
            const skip: any = page * limit - limit;
            const query = { $and: [] };
            query['$and'].push({ userId: req.user._id });

            const subQuery = { $or: [] };
            if (req.body.search) {
                subQuery['$or'].push({ requirement: { $regex: req.body.search, $options: 'i' } });
            }
            if (
                typeof subQuery !== 'undefined' &&
                Object.keys(subQuery).length > 0 &&
                subQuery['$or'].length > 0
            ) {
                query['$and'].push(subQuery);
            }

            const allrequirementData = await this.requirementService.listAllRequirement(query, parseInt(skip), parseInt(limit));

            if (allrequirementData) {
                return res.send(response.success_response(codes.success.ok, message.requirements.fetchAllrequirement, allrequirementData))
            }
        }
        catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public addRequirement = async (req: any, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.body,
                userId: req.user._id
            }
            const addNewrequirement = await this.requirementService.addRequirement(data)
            if (addNewrequirement) {
                return res.send(response.success_response(codes.success.ok, message.requirements.requirementCreated, addNewrequirement))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public updateRequirement = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const updaterequirementData = await this.requirementService.updateRequirement(data)
            if (updaterequirementData) {
                return res.send(response.success_response(codes.success.ok, message.requirements.requirementUpdated, updaterequirementData))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public deleteRequirement = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const id = req.body
            const deleterequirementData = await this.requirementService.deleteRequirement(id)
            if (deleterequirementData) {
                return res.send(response.success_response(codes.success.ok, message.requirements.requirementDeleted, []))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public changeCompletionStatus = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const requirementData = await this.requirementService.changeStatus(data);
            if (requirementData) {
                return res.send(response.success_response(codes.success.ok, message.requirements.changeStatus, requirementData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}
export default WebRequirementController;