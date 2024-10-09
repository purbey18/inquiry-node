import { RequestWithUser } from "@/interfaces/auth.interface";
import catchErrorHandler from "@/middlewares/error.middleware";
import { SourceService } from "@/services/source.services";
import { codes, message } from "@/utils/messages";
import response from "@/utils/response";
import { NextFunction, Request, Response } from "express";
export class WebSourceController {
    public sourceService = new SourceService();

    public allSource = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.body
            const skip: any = page * limit - limit;
            const query = { $and: [] };
            query['$and'].push({ });

            const subQuery = { $or: [] };
            if (req.body.search) {
                subQuery['$or'].push({ sourceName: { $regex: req.body.search, $options: 'i' } });
            }
            if (
                typeof subQuery !== 'undefined' &&
                Object.keys(subQuery).length > 0 &&
                subQuery['$or'].length > 0
            ) {
                query['$and'].push(subQuery);
            }
            const allsourceData = await this.sourceService.listAllSource(query, parseInt(skip), parseInt(limit));
            if (allsourceData) {
                return res.send(response.success_response(codes.success.ok, message.source.fetchAllSources, allsourceData))
            }
        }
        catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public addSource = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.body,
                userId: req.user._id
            }

            const findSourceName = await this.sourceService.findSource(data)
            if (findSourceName) {
                return res.send(response.error_response(codes.error.badRequest, message.source.sourceAlreadyExists))
            }
            const addNewsource = await this.sourceService.addSource(data);
            if (addNewsource) {
                return res.send(response.success_response(codes.success.ok, message.source.sourceCreated, addNewsource))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public updateSource = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const findSourceName = await this.sourceService.findSource(data)
            if (findSourceName) {
                return res.send(response.error_response(codes.error.badRequest, message.source.sourceAlreadyExists))
            }
            const updatesourceData = await this.sourceService.updateSource(data)
            if (updatesourceData) {
                return res.send(response.success_response(codes.success.ok, message.source.sourceUpdated, updatesourceData))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public deleteSource = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const id = req.body
            const deletesourceData = await this.sourceService.deleteSource(id)
            if (deletesourceData) {
                return res.send(response.success_response(codes.success.ok, message.source.sourceDeleted, []))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public changeSourceStatus = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const sourceData = await this.sourceService.changeStatus(data);
            if (sourceData) {
                return res.send(response.success_response(codes.success.ok, message.source.changeStatus, sourceData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}
export default WebSourceController;