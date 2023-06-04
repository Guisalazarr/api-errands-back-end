import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserMiddleware } from '../middlewares/user.middleware';
import { errandRoutes } from './errand.routes';

export const userRoutes = () => {
    const app = Router();

    app.get('/', new UserController().list);
    app.get('/:id', new UserController().get);
    app.post(
        '/',
        [UserMiddleware.validateCreateFields],
        new UserController().create
    );
    app.put('/:id', new UserController().update);
    app.delete('/:id', new UserController().delete);

    app.use('/:id/errand', errandRoutes());
    return app;
};
