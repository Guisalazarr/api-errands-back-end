import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../../../models/user.models';

export class UserController {
    public async list(req: Request, res: Response) {
        try {
            const users = await new UserRepository().list();

            return ApiResponse.success(
                res,
                'Users were successfully listed',
                users.map((user) => user.toJson())
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async get(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const user = await new UserRepository().get(id);

            if (!user) {
                return ApiResponse.notFound(res, 'User');
            }

            return ApiResponse.success(
                res,
                'Users were successfully listed',
                user.toJson()
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const repository = new UserRepository();
            const validateUserExist = await repository.validateAlreadyExist(
                email
            );

            if (validateUserExist) {
                return ApiResponse.badRequest(
                    res,
                    `User already exists with email: ${email}`
                );
            }

            const user = new User(name, email, password);
            await repository.create(user);

            return ApiResponse.success(
                res,
                'User was successfully created',
                user.toJson()
            );
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
