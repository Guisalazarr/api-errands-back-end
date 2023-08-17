import { ErrandStatus } from '../../../models/errand.models';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { Request, Response } from 'express';
import { CreateErrandUsecase } from '../usecases/create-errand.usecase';
export class CreateErrandController {
    constructor(private createUsecase: CreateErrandUsecase) {}

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
}
