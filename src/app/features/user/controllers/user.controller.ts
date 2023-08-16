import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../../../models/user.models';
import { GetUserUsecase } from '../usecases/get-user.usecase';
import { ListUserUsecase } from '../usecases/list-user.usecase';
import { CreateUserUsecase } from '../usecases/create-user.usecase';
import { LoginUsecase } from '../usecases/login-user.usecase';

export class UserController {
    constructor(
        private createUsecase: CreateUserUsecase,
        private listUsecase: ListUserUsecase,
        private getUsecase: GetUserUsecase,
        private loginUsecase: LoginUsecase
    ) {}

    public async list(req: Request, res: Response) {
        try {
            const result = await this.listUsecase.execute();

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async get(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const result = await this.getUsecase.execute(id);

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const result = await this.createUsecase.execute(req.body);

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const result = await this.loginUsecase.execute(req.body);

        return res.status(result.code).send(result);
    }
}
