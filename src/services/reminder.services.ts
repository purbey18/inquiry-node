import { HttpException } from "@/exceptions/HttpException";
import { codes, message } from "@/utils/messages";
import reminderModel from "@/models/reminder.model";

export class ReminderService {
    public reminder = reminderModel

    public async listAllReminder(query: any, skip?: any, limit?: any) {
        const allReminderData = await this.reminder.find(query)
            .skip(skip)
            .limit(limit)
            .select('-modifiedAt')
            .sort({ createdAt: -1 })
            .lean()

        const count = await this.reminder.find(query).count()
        if (allReminderData) {
            return { allReminderData, count }
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async addReminder(data: any) {
        const newReminder = await this.reminder.create(data);
        if (newReminder) {
            return newReminder
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToCreate);
        }
    }

    public async updateReminder(data: any) {
        const { id, ...rest } = data;
        const updateReminder = await this.reminder.findOneAndUpdate({ _id: data.id }, rest, { new: true, runValidators: true })
        if (updateReminder) {
            return updateReminder
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToUpdate);
        }
    }

    public async deleteReminder(data: any) {
        const reminderData = await this.reminder.findByIdAndDelete({ _id: data.id })
        if (reminderData) {
            return reminderData
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToDelete);
        }
    }

    public async changeStatus(data: any) {
        const reminderData = await this.reminder.findOneAndUpdate(
            { _id: data.id }, { status: data.status },
            { new: true, runValidators: true }
        )
        if (reminderData) {
            return reminderData
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToChangeStatus);
        }
    }
}