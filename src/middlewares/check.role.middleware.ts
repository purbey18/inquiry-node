import response from "@/utils/response";
import { codes, message } from "@/utils/messages";
import { NextFunction, Response } from "express";
import { RequestWithUser } from "@/interfaces/auth.interface";

const checkRole = (role) => {
    return (req: RequestWithUser, res: Response, next: NextFunction) => {
        if (req.user.userType === role) {
            next();
        } else {
            return res.send(response.error_response(codes.error.unAuthorized, message.failed.permissionDenied))
        }
    }
}

export default checkRole;