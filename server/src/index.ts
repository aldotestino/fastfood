import express from 'express';
import cors from 'cors';
import path from 'path';
import menuController from './controllers/menuController';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/menu', menuController);

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});

