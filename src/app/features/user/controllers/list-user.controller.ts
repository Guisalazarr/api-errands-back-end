import { ApiResponse } from '../../../shared/util/http-response.adapter';

import { Request, Response } from 'express';
import { ListUserUsecase } from '../usecases/list-user.usecase';

export class ListUserController {
    constructor(private listUsecase: ListUserUsecase) {}

    public async list(req: Request, res: Response) {
        try {
            const result = await this.listUsecase.execute();

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
