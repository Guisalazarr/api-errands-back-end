import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../../../models/user.models';
import { GetUserUsecase } from '../usecases/get-user.usecase';
import { ListUserUsecase } from '../usecases/list-user.usecase';
import { CreateUserUsecase } from '../usecases/create-user.usecase';

export class UserController {
    public async list(req: Request, res: Response) {
        try {
            const result = await new ListUserUsecase().execute();

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async get(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const result = await new GetUserUsecase().execute(id);

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const result = await new CreateUserUsecase().execute(req.body);

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await new UserRepository().getLogin(email, password);

        if (!user) {
            return ApiResponse.invalidCredentials(res);
        }

        return ApiResponse.success(res, 'Login successfully done', {
            id: user.id,
            name: user.name,
        });
    }
}
