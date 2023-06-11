import cors from 'cors';
import express, { Request, Response } from 'express';
import { userRoutes } from './routes/user.routes';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/user', userRoutes());

app.listen(process.env.PORT, () => {
    console.log('API is running...');
});
