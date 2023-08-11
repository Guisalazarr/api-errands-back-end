import { Router } from 'express';
import { ErrandController } from '../controllers/errand.controller';
import { ErrandValidator } from '../validators/errand.middleware';
import { LoginValidator } from '../../user/validators/login.validator';

export const errandRoutes = () => {
    const app = Router({
        mergeParams: true,
    });

    const logged = [LoginValidator.checkToken];

    app.get('/', logged, new ErrandController().list);
    app.get('/:errandId', logged, new ErrandController().get);
    app.post(
        '/',
        logged,
        [ErrandValidator.validateCreateFields],
        new ErrandController().create
    );
    app.put(
        '/:errandId',
        logged,
        [ErrandValidator.validateStatusErrand],
        new ErrandController().update
    );

    app.delete('/:errandId', logged, new ErrandController().delete);

    return app;
};
