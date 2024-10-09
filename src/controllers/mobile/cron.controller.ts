import { TodoService } from "@/services/todo.serices";
import { fireNotification } from "./notification.controller";
import { ReminderService } from "@/services/reminder.services";
import moment from "moment";

export class cronNotification {
    public todoService = new TodoService();
    public reminderService = new ReminderService();
    public notification = new fireNotification();

    public todoTaskList = async () => {
        let users = []
        const date = new Date();
        const query = {
            date: {
                $gte: moment(date).startOf('day'),
                $lte: moment(date).endOf('day'),
            }
        }
        const getTodayTodo = await this.todoService.listAllTodo(query)
        for (let i = 0; i < getTodayTodo.length; i++) {
            const title = getTodayTodo[i].title;
            const userId = getTodayTodo[i].userId
            await this.notification.todoTaskNotification(userId , title)
        }

    }

    public halfHourBeforeReminderList = async () => {
        const date = new Date()
        const halfHourBefore = new Date(new Date().getTime() + 30 * 60 * 1000);
        const time = moment(halfHourBefore).format('HH:mm')
        const query = {
            time: time,
            date: {
                $gte: moment(date).startOf('day'),
                $lte: moment(date).endOf('day'),
            }
        }

        const getReminders = await this.reminderService.listAllReminder(query)
        for (let i = 0; i < getReminders.allReminderData.length; i++) {
            let userId = getReminders.allReminderData[i].userId
            let reminderId = getReminders.allReminderData[i]._id
            let title = getReminders.allReminderData[i].title 
            let date = getReminders.allReminderData[i].date 

            await this.notification.halfHourBeforeReminderNotification(userId, time, reminderId , title , date)
        }
    }

    public reminderList = async () => {
        const date = new Date()
        const currentTime = new Date(new Date().getTime());
        const time = moment(currentTime).format('HH:mm')
        const query = {
            time: time,
            date: {
                $gte: moment(date).startOf('day'),
                $lte: moment(date).endOf('day'),
            }
        }
        const getReminders = await this.reminderService.listAllReminder(query)
        for (let i = 0; i < getReminders.allReminderData.length; i++) {
            let userId = getReminders.allReminderData[i].userId
            let reminderId = getReminders.allReminderData[i]._id
            let title = getReminders.allReminderData[i].title 
            let date = getReminders.allReminderData[i].date 
            
           await this.notification.reminderNotification(userId, time, reminderId , title , date)
        }
    }
}

