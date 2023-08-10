import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { errandRoutes } from '../../errands/routes/errand.routes';
import { UserValidator } from '../validators/user.validator';

export const appRoutes = () => {
    const app = Router();

    app.get('/', new UserController().list);
    app.get('/:id', new UserController().get);
    app.post(
        '/',
        [UserValidator.validateCreateFields],
        new UserController().create
    );
    app.post(
        '/login',
        [UserValidator.validateFieldsLogin],
        new UserController().login
    );
    app.use('/:id/errand', errandRoutes());
    return app;
};
