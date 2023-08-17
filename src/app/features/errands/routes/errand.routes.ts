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
        controller.listUsecase.list(req, res)
    );
    app.get('/:errandId', logged, (req: Request, res: Response) =>
        controller.getUsecase.get(req, res)
    );
    app.post(
        '/',
        logged,
        [ErrandValidator.validateCreateFields],
        (req: Request, res: Response) =>
            controller.createUsecase.create(req, res)
    );
    app.put(
        '/:errandId',
        logged,
        [ErrandValidator.validateStatusErrand],
        (req: Request, res: Response) =>
            controller.updateUsecase.update(req, res)
    );

    app.delete('/:errandId', logged, (req: Request, res: Response) =>
        controller.deleteUsecase.delete(req, res)
    );

    return app;
};
