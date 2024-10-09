import response from "@utils/response"
import catchErrorHandler from "@middlewares/error.middleware";
import bcrypt from "bcrypt";
import { UserService } from "@/services/auth.services"
import { NextFunction, Request, Response } from 'express';
import { message, codes } from "@/utils/messages";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { InquiryService } from "@/services/inquiry.services";

export class UserController {
    public userService = new UserService()
    public inquiryService = new InquiryService()
    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { password, email, confirmPassword, position_id } = req.body
            if (password !== confirmPassword) {
                return res.send(response.error_response(codes.error.badRequest, message.user.passwordAndConfirmPasswordNotMatch))
            }
            const checkUser = await this.userService.checkEmail(email)
            if (checkUser) {
                return res.send(response.error_response(codes.error.notFound, message.user.emailAlreadyExits))
            }
            const data = {
                ...req.body,
                password: await bcrypt.hash(password, 10),
            }

            if (position_id == 1) {
                data.userType = 'Admin'
            } else if (position_id == 2) {
                data.userType = 'Manager'
            } else if (position_id) {
                data.userType = 'Staff'
            }
            const registeredUser = await this.userService.saveUser(data)
            const user = {
                _id: registeredUser._id,
                full_name: registeredUser.full_name,
                about: registeredUser.about,
                email: registeredUser.email,
                userType: registeredUser.userType,
                status: registeredUser.status,
                remark: registeredUser.remark,
                createdAt: registeredUser.createdAt
            }
            if (registeredUser) {
                return res.send(response.success_response(codes.success.ok, message.user.registerSuccessfully, user))
            }

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public getAllUsers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.body
            const skip: any = page * limit - limit;
            let query = {};

            const subQuery = { $or: [] };
            if (req.body.search) {
                subQuery['$or'].push({ full_name: { $regex: req.body.search, $options: 'i' } });
                subQuery['$or'].push({ userType: { $regex: req.body.search, $options: 'i' } });
            }
            if (
                typeof subQuery !== 'undefined' &&
                Object.keys(subQuery).length > 0 &&
                subQuery['$or'].length > 0
            ) {
                query = { $and: [] };
                query['$and'].push(subQuery);
            }
            const getUsers = await this.userService.getAllUsers(query, parseInt(skip), parseInt(limit))
            if (getUsers) {
                return res.send(response.success_response(codes.success.ok, message.user.fetchedAllUsers, getUsers))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public getUserDetails = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const id = req.user
            const userData = await this.userService.getUserData(id)
            if (userData) {
                return res.send(response.success_response(codes.success.ok, message.user.profileDetails, userData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public editUserProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const body = req.body
            const data = {
                ...body,
                id: req.user._id
            }
            if(body.password){
                if(body.password !== body.confirmPassword) return res.send(response.error_response(codes.error.conflict, message.user.passwordAndConfirmPasswordNotMatch))
                
                data.password =  await bcrypt.hash(body.password, 10)
            }
            const editUser = await this.userService.editUserDetails(data)
            if (editUser) {
                return res.send(response.success_response(codes.success.ok, message.user.profileDetailUpdated, editUser))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public getAllManagerAndStaff = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const allUserData = await this.userService.listAllUsers();
            if (allUserData) {
                return res.send(response.success_response(codes.success.ok, message.user.getManagerAndStaff, allUserData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public adminEditUserProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { id, password, position_id, email, confirmPassword } = req.body
            if (password !== confirmPassword) {
                return res.send(response.error_response(codes.error.badRequest, message.user.passwordAndConfirmPasswordNotMatch))
            }
            const userData = await this.userService.getUserData(id);
            if (userData.email !== email) {
                const checkUser = await this.userService.checkEmail(req.body.email);
                if (checkUser) {
                    return res.send(response.error_response(codes.error.notFound, message.user.emailAlreadyExits))
                }
            }
            const data = { ...req.body }
            if (password) {
                data.password = await bcrypt.hash(password, 10)
            }

            if (position_id == 1) {
                data.userType = 'Admin'
            } else if (position_id == 2) {
                data.userType = 'Manager'
            } else if (position_id) {
                data.userType = 'Staff'
            }

            const editUser = await this.userService.editUserDetails(data)
            if (editUser) {
                return res.send(response.success_response(codes.success.ok, message.user.profileDetailUpdated, editUser))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public adminChangeUserStatus = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = {
                id: req.body.userId,
                status: req.body.status,
            };
            const userData = await this.userService.editUserDetails(data);
            if (userData) {
                return res.send(response.success_response(codes.success.ok, message.user.changeStatus, userData))
            }
        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }

    public topUserList = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            let responseArray = []
            const query = {}
            const getUserList = await this.userService.getAllUsers(query)
            for (let i = 0; i < getUserList.length; i++) {
                const findQuery = { $or: [{ userId: getUserList[i]._id }, { personId: getUserList[i]._id }] }
                const userInquiryList = await this.inquiryService.listAllInquiries(findQuery)
                
                const newInquiries = userInquiryList.allInquiries.filter((item => item.stepStatus == 'new'))
                const contactedInquiries = userInquiryList.allInquiries.filter((item => item.stepStatus == 'contacted'))
                const workingInquiries = userInquiryList.allInquiries.filter((item => item.stepStatus == 'working'))
                const wonInquiries = userInquiryList.allInquiries.filter((item => item.stepStatus == 'won'))
                const lostInquiries = userInquiryList.allInquiries.filter((item => item.stepStatus == 'lost'))

                let data = {
                    userId: getUserList[i]._id,
                    full_name: getUserList[i].full_name,
                    newInquiries: newInquiries.length,
                    contactedInquiries: contactedInquiries.length,
                    workingInquiries: workingInquiries.length,
                    wonInquiries: wonInquiries.length,
                    lostInquiries: lostInquiries.length
                }
                responseArray.push(data)
            }
            responseArray.sort((a, b) => b.wonInquiries - a.wonInquiries);
            return res.send(response.success_response(codes.success.ok, message.user.topUserList, responseArray.slice(0, 10)))

        } catch (error) {
            catchErrorHandler(error, req, res, next)
        }
    }
}