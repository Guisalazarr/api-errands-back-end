import cors from 'cors';
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import { appRoutes } from '../../app/features/user/routes/user.routes';

dotenv.config();

export class Server {
    public static create() {
        const app = express();
        app.use(express.json());
        app.use(cors());

        app.use('/user', appRoutes());

        return app;
    }

    public static listen(app: Express) {
        app.listen(process.env.PORT, () => {
            console.log('Servidor rodando na porta ' + process.env.PORT + '!');
        });
    }
}
