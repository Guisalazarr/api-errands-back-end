import { Request, Response, Router } from 'express';
import { ErrandController } from '../controllers/errand.controller';
import { ErrandValidator } from '../validators/errand.middleware';
import { LoginValidator } from '../../user/validators/login.validator';
import { CreateErrandController } from '../util/errands.factory';

export const errandRoutes = () => {
    const app = Router({
        mergeParams: true,
    });

    const logged = [LoginValidator.checkToken];
    const controller = CreateErrandController();

    app.get('/', logged, (req: Request, res: Response) =>
        controller.list(req, res)
    );
    app.get('/:errandId', logged, (req: Request, res: Response) =>
        controller.get(req, res)
    );
    app.post(
        '/',
        logged,
        [ErrandValidator.validateCreateFields],
        (req: Request, res: Response) => controller.create(req, res)
    );
    app.put(
        '/:errandId',
        logged,
        [ErrandValidator.validateStatusErrand],
        (req: Request, res: Response) => controller.update(req, res)
    );

    app.delete('/:errandId', logged, (req: Request, res: Response) =>
        controller.delete(req, res)
    );

    return app;
};
