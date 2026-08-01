import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errorHandler);

export default app;
