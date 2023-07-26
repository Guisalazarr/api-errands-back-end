import { Errand, ErrandStatus } from '../../../models/errand.models';
import { ErrandRepository } from '../repositories/errand.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { Request, Response } from 'express';

export class ErrandController {
    public async list(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, status } = req.query;

            const errands = await new ErrandRepository().list({
                userId: id,
                title: title?.toString(),
                status: status as ErrandStatus,
            });

            return ApiResponse.success(
                res,
                'Errand successfully listed',
                errands.map((errand) => errand.toJson())
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async get(req: Request, res: Response) {
        try {
            const { id, errandId } = req.params;

            const user = new UserRepository().get(id);

            if (!user) {
                return ApiResponse.notFound(res, 'User');
            }

            const errand = await new ErrandRepository().get(errandId);
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

    public async create(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, description } = req.body;

            const user = await new UserRepository().get(id);

            if (!user) {
                return ApiResponse.notFound(res, 'User');
            }
            const errand = new Errand(title, description, user);
            await new ErrandRepository().create(errand);

            return ApiResponse.success(
                res,
                'Errand successfully created',
                errand.toJson()
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id, errandId } = req.params;

            const user = await new UserRepository().get(id);
            if (!user) {
                return ApiResponse.notFound(res, 'User');
            }

            const repository = new ErrandRepository();
            const deleteErrand = await repository.delete(errandId);

            if (deleteErrand == 0) {
                return ApiResponse.notFound(res, 'errand');
            }
            const errands = await repository.list({
                userId: user.id,
                status: ErrandStatus.unarchived,
            });

            return ApiResponse.success(
                res,
                'Errand successfully deleted',
                errands.map((errand) => errand.toJson())
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id, errandId } = req.params;
            const { title, description, status } = req.body;

            const user = await new UserRepository().get(id);

            if (!user) {
                return ApiResponse.notFound(res, 'User');
            }

            const repository = new ErrandRepository();
            const errand = await repository.get(errandId);

            if (!errand) {
                return ApiResponse.notFound(res, 'Errand');
            }
            if (title) {
                errand.title = title;
            }
            if (description) {
                errand.description = description;
            }
            if (status) {
                errand.status = status;
            }

            await repository.update(errand);

            const errands = await repository.list({
                userId: user.id,
                status: ErrandStatus.unarchived,
            });

            return ApiResponse.success(
                res,
                'Errand successfully edited',
                errands.map((errand) => errand.toJson())
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
