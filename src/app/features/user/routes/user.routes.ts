import { Request, Response, Router } from 'express';
import { errandRoutes } from '../../errands/routes/errand.routes';
import { UserValidator } from '../validators/user.validator';
import { LoginValidator } from '../validators/login.validator';
import { createUserController } from '../util/user.factory';

export const appRoutes = () => {
    const app = Router();

    const controller = createUserController();

    app.get('/', (req: Request, res: Response) => controller.list(req, res));
    app.get('/:id', (req: Request, res: Response) => controller.get(req, res));
    app.post(
        '/',
        [UserValidator.validateCreateFields, UserValidator.validatePassword],
        (req: Request, res: Response) => controller.create(req, res)
    );
    app.post(
        '/login',
        [LoginValidator.validateFieldsLogin],
        (req: Request, res: Response) => controller.login(req, res)
    );
    app.use('/:id/errand', errandRoutes());
    return app;
};
