import { Router } from 'express';
import { ErrandController } from '../controllers/errand.controller';
import { ErrandMiddleware } from '../middlewares/errand.middleware';

export const errandRoutes = () => {
    const app = Router({
        mergeParams: true,
    });

    app.get('/', new ErrandController().list);
    app.get('/:errandId', new ErrandController().get);
    app.post(
        '/',
        [
            ErrandMiddleware.validateCreateFields,
            ErrandMiddleware.validateStatusErrand,
        ],
        new ErrandController().create
    );
    app.put(
        '/:errandId',
        [ErrandMiddleware.validateStatusErrand],
        new ErrandController().update
    );

    app.delete('/:errandId', new ErrandController().delete);

    return app;
};
