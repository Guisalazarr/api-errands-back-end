import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserMiddleware } from '../middlewares/user.middleware';
import { errandRoutes } from './errand.routes';

export const userRoutes = () => {
    const app = Router();

    app.post(
        '/',
        [UserMiddleware.validateCreateFields],
        new UserController().create
    );
    app.post(
        '/login',
        [UserMiddleware.validateFieldsLogin],
        new UserController().login
    );

    app.use('/:id/errand', errandRoutes());
    return app;
};
