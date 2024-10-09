import { cronNotification } from '@/controllers/mobile/cron.controller';
import cron from 'node-cron'

export class cronFunction {
    public cronNotification = new cronNotification()

    public cronFunction = async (app) => {
        cron.schedule('0 10 * * *', () => {
            this.cronNotification.todoTaskList()
        });

        cron.schedule('* * * * *', () => {
            this.cronNotification.halfHourBeforeReminderList()
            this.cronNotification.reminderList()
        })

        app.get('/cron', async (req, res) => {
            const result = await this.cronNotification.todoTaskList()
            // const result = await this.cronNotification.halfHourBeforeReminderList()
            // const result = await this.cronNotification.reminderList()
            return res.send(result)
        })

    }
}