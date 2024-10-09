import App from '@/app';
import validateEnv from '@utils/validateEnv';
import apiRoutes from './routes/mobile.route';
import webRoutes from './routes/web.route';

validateEnv();

const app = new App([new apiRoutes() , new webRoutes()]);

app.listen();
