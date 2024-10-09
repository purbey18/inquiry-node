import { HttpException } from "@/exceptions/HttpException";
import { codes, message } from "@/utils/messages";
import categoryModel from "@/models/category.model";
import MessageModel from "@/models/message.model";

export class MessageService {
    public message = MessageModel

    public async getAllMessage() {
        
        const getMessages = await this.message.find().populate('userId', 'full_name userType').sort({ createdAt: -1 });
        if (getMessages) {
            return getMessages
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async storeMessage(data: any) {
        
        const newMessage = await this.message.create(data);
        const msgWithUserData = await this.message.findOne({ _id: newMessage._id }).populate('userId', 'full_name userType');
        if (newMessage && msgWithUserData) {
            return msgWithUserData
        } else {
            throw new HttpException(codes.error.badRequest, message.chatMessage.failToStoreMessage);
        }
    }

}