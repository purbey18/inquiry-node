import { RequestWithUser } from "@/interfaces/auth.interface";
import { ReminderService } from "@/services/reminder.services";
import { codes, message } from "@/utils/messages";
import { NextFunction, Response } from "express";
import catchErrorHandler from "@/middlewares/error.middleware";
import response from "@/utils/response";
import moment from "moment";
export class WebReminderController {
    public reminderService = new ReminderService();

    public allReminders = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { page, limit, startDate, endDate, search, inquiryReminder } = req.body
            const skip: any = page * limit - limit;
            const query = { $and: [] };
            query['$and'].push({ userId: req.user._id });

            const subQuery = { $or: [] };
            if (search) {
                subQuery['$or'].push({ title: { $regex: search, $options: 'i' } });
            }
            if (inquiryReminder) {
                subQuery['$or'].push({ inquiryId: { $exists: inquiryReminder } });
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
            const allReminderData = await this.reminderService.listAllReminder(query, parseInt(skip), parseInt(limit));
            if (allReminderData) {
                return res.send(response.success_response(codes.success.ok, message.reminder.fetchAllReminders, allReminderData))
            }
        }
        catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public addReminder = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.body,
                userId: req.user._id
            }
            const addNewReminder = await this.reminderService.addReminder(data);
            if (addNewReminder) {
                return res.send(response.success_response(codes.success.ok, message.reminder.reminderCreated, addNewReminder))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public updateReminder = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const updateReminderData = await this.reminderService.updateReminder(data)
            if (updateReminderData) {
                return res.send(response.success_response(codes.success.ok, message.reminder.reminderUpdated, updateReminderData))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public deleteReminder = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const id = req.body
            const deleteReminderData = await this.reminderService.deleteReminder(id)
            if (deleteReminderData) {
                return res.send(response.success_response(codes.success.ok, message.reminder.reminderDeleted, []))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public changeReminderStatus = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const reminderData = await this.reminderService.changeStatus(data);
            if (reminderData) {
                return res.send(response.success_response(codes.success.ok, message.reminder.changeStatus, reminderData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}
export default WebReminderController;