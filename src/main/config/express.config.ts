import cors from 'cors';
import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { appRoutes } from '../../app/features/user/routes/user.routes';

dotenv.config();

export const createApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.get('/', (req: Request, res: Response) =>
        res.status(200).json({ ok: true, message: 'API JOBS' })
    );

    app.use('/user', appRoutes());

    return app;
};
