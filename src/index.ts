import cors from 'cors';
import express from 'express';
import { userRoutes } from './routes/user.routes';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { Database } from './database/config/database.connection';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/user', userRoutes());

Database.connect().then(() => {
    console.log('Database is connected!');

    app.listen(process.env.PORT, () => {
        console.log('Servidor rodando na porta ' + process.env.PORT + '!');
    });
});
