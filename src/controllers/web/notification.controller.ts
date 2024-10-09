import { NextFunction, Response } from "express";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { codes, message } from "@/utils/messages";
import catchErrorHandler from "@/middlewares/error.middleware";
import NotificationModel from "@/models/notification.model";
import moment from "moment";
import response from "@/utils/response";

export class webNotification {
    public notificationList = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate } = req.body
            const query = {
                userId: req.user._id,
                status: 0
            }
            if (startDate && endDate) {
                query['createdAt'] = {
                    $gte: moment(startDate, 'DD-MM-YYYY').startOf('day'),
                    $lte: moment(endDate, 'DD-MM-YYYY').endOf('day')
                }
            }
            const allNotification = await NotificationModel.find(query).sort({ createdAt: -1 })
            return res.send(response.success_response(codes.success.ok, message.notification.allNotification, allNotification))


        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public clearNotification = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const id = req.user._id
            const updateUserNotiication = await NotificationModel.updateMany({ userId: id }, { status: 1 }, { new: true, runValidators: true })
            return res.send(response.success_response(codes.success.ok, message.notification.clearNotification, updateUserNotiication))
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}