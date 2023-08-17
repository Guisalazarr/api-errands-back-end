import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { Request, Response } from 'express';
import { GetUserUsecase } from '../usecases/get-user.usecase';

export class GetUserController {
    constructor(private getUsecase: GetUserUsecase) {}

    public async get(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const result = await this.getUsecase.execute(id);

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
