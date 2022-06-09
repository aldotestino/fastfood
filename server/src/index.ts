import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import menuController from './controllers/menuController';
import clientController from './controllers/clientController';
import { Client, Cook } from '@prisma/client';
import cookController from './controllers/cookController';
import { handleError } from './utils/middlewares';

const PORT = process.env.PORT || 3001;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      client: Partial<Client>,
      cook: Partial<Cook>
    }
  }
}

const app = express();

app.use(cors({
  origin: 'http://192.168.1.101:3000',
  credentials: true
}));
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/menu', menuController);
app.use('/api/v1/client', clientController);
app.use('/api/v1/cook', cookController);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
