import cors from 'cors';
import express, { Request, Response } from 'express';
import { userRoutes } from './routes/user.routes';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/user', userRoutes());
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log('API is running...');
});
