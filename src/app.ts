import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import path from "path";
import morgan from 'morgan';
import fileUpload from "express-fileupload"
import catchErrorHandler from '@middlewares/error.middleware';
import { cronFunction } from './utils/cron';
import { connect, set } from 'mongoose';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, APP_URL } from '@config';
import { dbConnection } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import { logger, stream } from '@utils/logger';
import { SocketServer } from './utils/socket';
import http from 'http';
process.env.TZ = 'Asia/Kolkata'; // UTC +05:30
class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public server: any;
  // public server = http.createServer(this.app)

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.cronFunction();
    this.server = http.createServer(this.app)
    new SocketServer(this.server)
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }


  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    connect(dbConnection.url);

  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet({ crossOriginResourcePolicy: false }));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(fileUpload())
    this.app.use('/uploads', express.static(path.resolve(__dirname + '/uploads')));
    this.app.use('/', express.static(path.resolve(__dirname + '/view')));
    this.app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }


  public cron = new cronFunction()
  public cronFunction() {
    this.cron.cronFunction(this.app)
  }

  private initializeRoutes(routes: Routes[]) {
      this.app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/view/index.html'));
    })
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }


  private initializeErrorHandling() {
    this.app.use(catchErrorHandler);
  }
}

export default App;
