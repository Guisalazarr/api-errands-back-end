import { Request, Response, Router } from 'express';
import { ErrandValidator } from '../validators/errand.middleware';
import { LoginValidator } from '../../user/validators/login.validator';
import { ErrandController } from '../util/errands.factory';

export const errandRoutes = () => {
    const app = Router({
        mergeParams: true,
    });

    const logged = [LoginValidator.checkToken];
    const controller = new ErrandController();

    app.get('/', logged, (req: Request, res: Response) =>
        controller.listErrand.list(req, res)
    );
    app.get('/:errandId', logged, (req: Request, res: Response) =>
        controller.getErrand.get(req, res)
    );
    app.post(
        '/',
        logged,
        [ErrandValidator.validateCreateFields],
        (req: Request, res: Response) =>
            controller.createErrand.create(req, res)
    );
    app.put(
        '/:errandId',
        logged,
        [ErrandValidator.validateStatusErrand],
        (req: Request, res: Response) =>
            controller.updateErrand.update(req, res)
    );

    app.delete('/:errandId', logged, (req: Request, res: Response) =>
        controller.deleteErrand.delete(req, res)
    );

    return app;
};
