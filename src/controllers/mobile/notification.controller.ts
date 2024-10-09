import { NextFunction, Response } from "express";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { codes, message } from "@/utils/messages";
import catchErrorHandler from "@/middlewares/error.middleware";
import userModel from "@/models/users.model";
import NotificationModel from "@/models/notification.model";
import Notification from "@/utils/notification";
import moment from "moment";
import response from "@/utils/response";

export class fireNotification {
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

    public addNewNotification = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = { ...req.body }
            const allUser = await userModel.find().select('device_token')
            const userWithDeviceToken = allUser.filter(item => item.device_token != '')
            const users = allUser.map(({ _id }) => _id)
            const userTokens = userWithDeviceToken.map(({ device_token }) => device_token)
            if (userTokens.length > 0) {
                const tokens = userTokens
                const title = data.title;
                const body = data.body;
                const type = data.type;
                const user = users;
                const dataObj = data.data ? data.data : {};

                await Notification(tokens, title, body, type, user, dataObj)
            }
            res.send({
                status: true,
                status_code: 200,
                message: 'Notificaation sent successfully'
            })
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

    public async todoTaskNotification(userId , title) {
        const userTokens = await userModel.findOne({ _id: userId }).distinct('device_token')
        userTokens.filter(item => item != '')

        const tokens = userTokens
        const todoTitle = title;
        const body = `You have added todo for today`;
        const type = `Todo`;
        const user = userId;
        const dataObj = {};

        return await Notification(tokens, todoTitle, body, type, user, dataObj)
    }

    public async halfHourBeforeReminderNotification(userId, time, reminderId , title , date) {
        const userTokens = await userModel.find({ _id: userId }).distinct('device_token')
        userTokens.filter(item => item != '')

        const tokens = userTokens
        const reminderTitle = title;
        const body = `You have set a reminder after half hour at ${time}`;
        const type = `Reminder`;
        const user = userId;
        const dataObj = { id: reminderId , date : date };

        return await Notification(tokens, reminderTitle, body, type, user, dataObj)
    }


    public async reminderNotification(userId, time, reminderId , title , date) {
        const userTokens = await userModel.find({ _id: userId }).distinct('device_token')
        userTokens.filter(item => item != '')

        const tokens = userTokens
        const reminderTitle = title;
        const body = `You have a set reminder at ${time}`;
        const type = `Reminder`;
        const user = userId;
        const dataObj = { id: reminderId , date : date};

        return await Notification(tokens, reminderTitle, body, type, user, dataObj)
    }

    public async inquiryAssignNotification(inquiry) {
        const userData = await userModel.findOne({ _id : inquiry.userId })
        const assignUserData = await userModel.findOne({ _id: inquiry.personId })

        const tokens = assignUserData.device_token
        const title = `${userData.full_name} has assign you a new inquiry`;
        const body = `You have been assign a new inquiry`;
        const type = `Inquiry`;
        const user = inquiry.personId;
        const dataObj = { inquiryId : inquiry._id};

        return await Notification(tokens, title, body, type, user, dataObj)
    }
}





