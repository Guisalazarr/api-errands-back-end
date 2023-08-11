import { Errand, ErrandStatus } from '../../../models/errand.models';
import { ErrandRepository } from '../repositories/errand.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { Request, Response } from 'express';
import { ListErrandsUseCase } from '../usecases/list-errands.usecase';
import { GetErrandUseCase } from '../usecases/get-errand.usecase';
import { CreateUserUsecase } from '../../user/usecases/create-user.usecase';
import { CreateErrandUsecase } from '../usecases/create-errand.usecase';
import { Return } from '../../../shared/util/return.adpter';

export class ErrandController {
    public async list(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, status } = req.query;

            const result = await new ListErrandsUseCase().execute({
                userId: id,
                title: title?.toString(),
                status: status as ErrandStatus,
            });

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async get(req: Request, res: Response) {
        try {
            const { id, errandId } = req.params;

            const result = await new GetErrandUseCase().execute({
                userId: id,
                errandId,
            });

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, description } = req.body;

            const result = await new CreateErrandUsecase().execute({
                userId: id,
                title,
                description,
            });

            return res.status(result.code).send(result);
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
