import { Errand } from '../models/errand.models';
import { ErrandRepository } from '../repositories/errand.repository';
import { UserRepository } from '../repositories/user.repository';
import { ApiResponse } from '../util/http-response.adapter';
import { Request, Response } from 'express';

export class ErrandController {
    public list(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title } = req.query;

            const user = new UserRepository().get(id);

            if (!user) {
                return ApiResponse.notFound(res, 'User');
            }

            const errands = new ErrandRepository().list(
                user,
                title?.toString()
            );

            return ApiResponse.success(
                res,
                'Errand successfully listed',
                errands.map((errand) => errand.toJson())
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public get(req: Request, res: Response) {
        try {
            const { id, errandId } = req.params;

            const user = new UserRepository().get(id);

            if (!user) {
                return ApiResponse.notFound(res, 'User');
            }

            const errand = new ErrandRepository().get(user, errandId);
            if (!errand) {
                return ApiResponse.notFound(res, 'Errand');
            }

            return ApiResponse.success(
                res,
                'Errand successfully listed',
                errand.toJson()
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public create(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, description } = req.body;

            const user = new UserRepository().get(id);
            if (!user) {
                return ApiResponse.notFound(res, 'User');
            }
            const errand = new Errand(title, description);
            new ErrandRepository().create(user, errand);

            return ApiResponse.success(
                res,
                'Errand successfully created',
                errand.toJson()
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public delete(req: Request, res: Response) {
        try {
            const { id, errandId } = req.params;

            const user = new UserRepository().get(id);
            if (!user) {
                return ApiResponse.notFound(res, 'User');
            }
            const errand = new ErrandRepository().delete(user, errandId);

            if (!errand) {
                return ApiResponse.notFound(res, 'user');
            }

            return ApiResponse.success(
                res,
                'Errand successfully deleted',
                errand[0].toJson()
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public update(req: Request, res: Response) {
        try {
            const { id, errandId } = req.params;
            const { title, description } = req.body;

            const user = new UserRepository().get(id);

            if (!user) {
                return ApiResponse.notFound(res, 'User');
            }

            const errand = new ErrandRepository().get(user, errandId);
            if (!errand) {
                return ApiResponse.notFound(res, 'Errand');
            }

            if (title) {
                errand.title = title;
            }
            if (description) {
                errand.description = description;
            }

            return ApiResponse.success(
                res,
                'Errand successfully edited',
                errand.toJson()
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
