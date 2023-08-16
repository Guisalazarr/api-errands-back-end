import { ErrandStatus } from '../../../models/errand.models';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { Request, Response } from 'express';
import { ListErrandsUseCase } from '../usecases/list-errands.usecase';
import { GetErrandUseCase } from '../usecases/get-errand.usecase';
import { CreateErrandUsecase } from '../usecases/create-errand.usecase';
import { DeleteErrandUsecase } from '../usecases/delete-errands.usecase';
import { UpdateErrandsUseCase } from '../usecases/update-errand.usecase';

export class ErrandController {
    constructor(
        private createUsecase: CreateErrandUsecase,
        private listUsecase: ListErrandsUseCase,
        private getUsecase: GetErrandUseCase,
        private deleteUsecase: DeleteErrandUsecase,
        private updateUsecase: UpdateErrandsUseCase
    ) {}

    public async list(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, status } = req.query;

            const result = await this.listUsecase.execute({
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

            const result = await this.getUsecase.execute({
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

            const result = await this.createUsecase.execute({
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

            const result = await this.deleteUsecase.execute({
                userId: id,
                errandId,
            });

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id, errandId } = req.params;
            const { title, description, status } = req.body;

            const result = await this.updateUsecase.execute({
                userId: id,
                errandId,
                title,
                description,
                status,
            });

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
