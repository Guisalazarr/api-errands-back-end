import { Request, Response, Router } from 'express';
import { errandRoutes } from '../../errands/routes/errand.routes';
import { UserValidator } from '../validators/user.validator';
import { LoginValidator } from '../validators/login.validator';
import { UserController } from '../util/user.factory';

export const appRoutes = () => {
    const app = Router();

    const controller = new UserController();

    app.get('/', (req: Request, res: Response) =>
        controller.listUsecase.list(req, res)
    );
    app.get('/:id', (req: Request, res: Response) =>
        controller.getUsecase.get(req, res)
    );
    app.post(
        '/',
        [UserValidator.validateCreateFields, UserValidator.validatePassword],
        (req: Request, res: Response) =>
            controller.createUsecase.create(req, res)
    );
    app.post(
        '/login',
        [LoginValidator.validateFieldsLogin],
        (req: Request, res: Response) => controller.loginUsecase.login(req, res)
    );
    app.use('/:id/errand', errandRoutes());
    return app;
};
