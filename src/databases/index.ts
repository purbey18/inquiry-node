import { DB_HOST, DB_PORT, DB_DATABASE, MONGO_DB_URL } from '@config';

export const dbConnection = {
  url: MONGO_DB_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
};
