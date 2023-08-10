import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserMiddleware } from '../validators/user.middleware';
import { errandRoutes } from '../../errands/routes/errand.routes';

export const appRoutes = () => {
    const app = Router();

    app.get('/', new UserController().list);
    app.get('/:id', new UserController().get);
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
