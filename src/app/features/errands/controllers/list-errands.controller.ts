import { ErrandStatus } from '../../../models/errand.models';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { Request, Response } from 'express';
import { ListErrandsUseCase } from '../usecases/list-errands.usecase';

export class ListErrandController {
    constructor(private listUsecase: ListErrandsUseCase) {}

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
}
