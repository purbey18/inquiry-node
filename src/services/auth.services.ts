import { codes, message } from "@/utils/messages";
import { sign, verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from "@/exceptions/HttpException";
import userModel from "@/models/users.model";

export class UserService {
    public User = userModel

    public createToken(user: any) {
        const dataStoredInToken = { _id: user._id };
        const secretKey = SECRET_KEY;
        const expiresIn = '365d';
        const token = sign(dataStoredInToken, secretKey, { expiresIn })
        return token;
    }

    public async decodeToken(token: any) {
        const secretKey = SECRET_KEY;
        const tokenData = await verify(token, secretKey)
        return tokenData;
    }

    public async checkEmail(email: String) {
        const findUser = await this.User.findOne({ email: email })
        return findUser ? findUser : null
    }

    public async saveUser(data: object) {
        const createUser = await this.User.create(data)
        if (createUser) {
            return createUser
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToCreate);
        }
    }

    public async getAllUsers(query: any, skip?: any, limit?: any) {
        const data = await this.User.find(query)
            .skip(skip)
            .limit(limit)
            .select('-modifiedAt -password -device_token')
            .lean()

        if (data) {
            return data
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async getAllAdminUsers() {
        const data = await this.User.find({ position_id: 1 }).distinct('_id').lean()
        if (data) {
            return data
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async getUserData(id: any) {
        const userdata = await this.User.findOne({ _id: id }).select('-modifiedAt -password -device_token').lean()
        if (userdata) {
            return userdata
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async editUserDetails(data: any) {
        
        const { id, ...rest } = data;
        const user = await this.User.findByIdAndUpdate({ _id: data.id }, rest, { new: true, runValidators: true }).select('-modifiedAt -password -device_token')
        if (user) {
            return user
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToDelete);
        }
    }

    public async listAllUsers() {
        const allUsers = await this.User.find({ position_id: { $ne: 1 } })
            .select('-password')
            .lean()

        if (allUsers) {
            return allUsers
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async getProductionUserData() {
        const data = await this.User.findOne({ position_id: 4 }).lean()
        if (data) {
            return data
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async removeDeviceToken(id: any) {
        const findUser = await this.User.findOne({ _id: id })
        if (findUser) {
            findUser.device_token = ''
            findUser.save()
            return findUser
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.somethingWentWrong);
        }
    }
}

