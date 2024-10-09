import bcrypt from "bcrypt";
import response from "@utils/response"
import catchErrorHandler from "@middlewares/error.middleware";
import { UserService } from "@/services/auth.services"
import { NextFunction, Request, Response } from 'express';
import { message, codes } from "@/utils/messages";
import { RequestWithUser } from "@/interfaces/auth.interface";
export class UserController {
    public userService = new UserService();

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password, device_token } = req.body;
            const userData = await this.userService.checkEmail(email)
            if (!userData) {
                return res.send(response.error_response(codes.error.notFound, message.user.incorrectEmail))
            }
            const isMatch = await bcrypt.compare(password, userData.password);
            if (!isMatch) {
                return res.send(response.error_response(codes.error.notFound, message.user.incorrectPassword))
            }
            const data = {
                id: userData._id,
                device_token: device_token
            }
            const storeDeviceToken = await this.userService.editUserDetails(data)
            if (storeDeviceToken) {
                const token = await this.userService.createToken(userData)
                const user = {
                    _id: userData._id,
                    full_name: userData.full_name,
                    about: userData.about,
                    email: userData.email,
                    userType: userData.userType,
                    status: userData.status,
                    remark: userData.remark,
                    createdAt: userData.createdAt
                }
                return res.send({
                    status: true,
                    status_code: String(codes.success.ok),
                    message: message.user.loggedIn,
                    data: { user, token }
                })
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public logout = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const id = req.user._id
            const userDate = await this.userService.removeDeviceToken(id)
            if (userDate) {
                return res.send({
                    status: true,
                    status_code: String(codes.success.ok),
                    message: message.user.logoutSuccessfull
                })
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}