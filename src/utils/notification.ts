import NotificationModel from "@/models/notification.model";
import admin from "firebase-admin";

const firebaseConfig = admin.initializeApp({
    credential: admin.credential.cert("glasierinq-firebase-admins-key.json"),
})

const Notification = async (tokens = [], title = "", body = "", type = "", user = [], data = {}) => {
    try {
        tokens = Array.isArray(tokens) ? tokens : [tokens];
        user = Array.isArray(user) ? user : [user];
        tokens = [...new Set(tokens)];
        tokens = tokens.filter(item => item != '');

        console.log({ tokens, title, body, type, user, data });
        if (tokens.length > 0) {
            const registrationToken = tokens;
            const payload = {
                'notification': {
                    'title': `${title}`,
                    'body': `${body}`,
                },
                'data': {
                    'type': `${type}`,
                    'dataObj': JSON.stringify(data)
                }
            };
            const result = await firebaseConfig.messaging().sendToDevice(registrationToken, payload)
            console.log({ result })
        }
        const notifications = user.map(userId => ({
            userId, title, body, type, data
        }))
        const insertedNotifications = await NotificationModel.insertMany(notifications)
        console.log({ insertedNotifications })
    } catch (error) {
        console.log(error)
    }
}

export default Notification;

