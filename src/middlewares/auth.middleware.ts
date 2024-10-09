import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { codes, message } from '@/utils/messages';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import response from '@/utils/response';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);
      if (findUser) {
        req.user = findUser;
        next();
      } else {
        res.send(response.error_response(codes.error.unAuthorized, message.user.invalidToken))
      }
    } else {
      res.send(response.error_response(codes.error.notFound, message.user.tokenMissing))
    }
  } catch (error) {
    res.send(response.error_response(codes.error.unAuthorized, message.user.invalidToken))
  }
};

export default authMiddleware;
