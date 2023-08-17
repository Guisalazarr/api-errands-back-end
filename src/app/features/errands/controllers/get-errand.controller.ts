import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { Request, Response } from 'express';
import { GetErrandUseCase } from '../usecases/get-errand.usecase';

export class GetErrandController {
    constructor(private getUsecase: GetErrandUseCase) {}

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
}
