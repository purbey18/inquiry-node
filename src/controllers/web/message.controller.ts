import response from '@utils/response';
import catchErrorHandler from '@middlewares/error.middleware';
import { NextFunction, Response } from 'express';
import { message, codes } from '@/utils/messages';
import { MessageService } from '@/services/message.services';
import { RequestWithUser } from '@/interfaces/auth.interface';
import fs from 'fs';

export class WebMessagesController {
  public messageService = new MessageService();

  public storeMessage = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      data.roomId = process.env.ROOM_ID;
      data.userId = req.user._id;
      const storeMessage = await this.messageService.storeMessage(data);

      return res.send({
        status: true,
        status_code: String(codes.success.ok),
        message: message.chatMessage.messageStored,
        data: storeMessage,
      });
    } catch (error) {
      catchErrorHandler(error, req, res, next);
    }
  };

  public sendDocument = async (req: any, res: Response, next: NextFunction) => {
    try {
      const data = {
        ...req.body,
      };

      if (req.files) {
        let sendDocumentArray = [];
        let sendDocument = req.files.sendDocument;
        sendDocument = Array.isArray(sendDocument)
          ? sendDocument
          : [sendDocument];
        const storedFiles = './src/uploads/chatImages/';
        const fileTypes = [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'application/pdf',
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword'
        ];
        if (sendDocument.length > 0) {
          sendDocument.forEach((doc) => {
            if (!fileTypes.includes(doc.mimetype)) {
              return res.send(
                response.error_response(
                  codes.error.badRequest,
                  message.file.fileTypeInvalid
                )
              );
            }
            if (doc.size >= 1024 * 1024 * 5) {
              // if getter than 5MB
              return res.send(
                response.error_response(
                  codes.error.badRequest,
                  message.file.fileTooBig
                )
              );
            }
          });
          for (let i = 0; i < sendDocument.length; i++) {
            const fileData = sendDocument[i];
            const splitFileName = sendDocument[i].name.split('.');
            const fileName =
              splitFileName[0] + '-' + Date.now() + '.' + splitFileName[1];
            const uploadFile = () => {
              return new Promise((resolve, reject) => {
                //upload the file, then call the callback with the location of the file
                fileData.mv(storedFiles + fileName, function (error) {
                  if (error) {
                    reject(error);
                    return res.send(
                      response.error_response(
                        codes.error.badRequest,
                        message.file.fileUploadfailed
                      )
                    );
                  }
                  resolve('image uploaded successfully');
                });
              });
            };
            await uploadFile();
            sendDocumentArray.push(fileName);
          }
          data.sendDocument = sendDocumentArray;
        }
      }
      // if (data.oldImg && data.oldImg.length > 0) {
      //     const storedFiles = './src/uploads/chatImages/';
      //     for (let i = 0; i < data.oldImg.length; i++) {
      //         fs.unlinkSync(storedFiles + data.oldImg[i]);
      //     }
      // }

      return res.send(
        response.success_response(
          codes.success.ok,
          message.chatMessage.docStoredSuccess,
          data.sendDocument
        )
      );
    } catch (error) {
      catchErrorHandler(error, req, res, next);
    }
  };
}
