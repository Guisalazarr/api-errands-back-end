import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { Request, Response } from 'express';
import { UpdateErrandsUseCase } from '../usecases/update-errand.usecase';

export class UpdateErrandController {
    constructor(private updateUsecase: UpdateErrandsUseCase) {}

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
