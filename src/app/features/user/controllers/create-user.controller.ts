import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { GetUserUsecase } from '../usecases/get-user.usecase';
import { ListUserUsecase } from '../usecases/list-user.usecase';
import { CreateUserUsecase } from '../usecases/create-user.usecase';

export class CreateUserController {
    constructor(private createUsecase: CreateUserUsecase) {}

    public async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const result = await this.createUsecase.execute(req.body);

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
