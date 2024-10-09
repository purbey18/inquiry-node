import response from '@utils/response';
import catchErrorHandler from '@middlewares/error.middleware';
import { UserService } from '@/services/auth.services';
import { ChatEvent, message, codes } from './messages';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { MessageService } from '@/services/message.services';

type UsersObj = {
    roomId: string;
    userId: string;
    socketId: string;
}

export class SocketServer {
  public static instance: SocketServer;
  public userService = new UserService();
  public users : Array<UsersObj>;
  private io: Server;
  public messageService = new MessageService()

  constructor(server: HttpServer) {
    this.users = []
    this.io = new Server(server, {
      // serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: '*',
      },
    });

    this.createSocketConnection();
  }

  public createSocketConnection = async () => {
    try {
      this.io.on(ChatEvent.CONNECT, (socket: Socket) => {
        const roomId = process.env.ROOM_ID

        socket.on(ChatEvent.JOIN_ROOM,async (userId: string) => {
            const userObj: UsersObj = {
                roomId: roomId,
                userId: userId,
                socketId: socket.id,
            };
            this.users.push(userObj)

            // join room
            socket.join(userObj.roomId);
            const getAllMessages = await this.messageService.getAllMessage()
            socket.emit(ChatEvent.REC_ALL_MESSAGE, getAllMessages)  // old msg;
          }
        );

        socket.on(ChatEvent.SEND_MESSAGE, async (message: string, messageType: string) => { // userId: string, roomId: string, 
            const userObj = this.users.find(user => user.socketId === socket.id);
            const storeMessage = await this.messageService.storeMessage({
                message: message,
                messageType: messageType,
                userId: userObj.userId,
                roomId: roomId
              })
            
            this.io.to(roomId).emit(ChatEvent.REC_MESSAGE, storeMessage);
        });

      });
    } catch (error) {
      console.log('--ERROR In createSocketConnection-->', error);
    }
  }
}
