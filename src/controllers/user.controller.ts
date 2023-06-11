import { Request, Response } from 'express';
import { ApiResponse } from '../util/http-response.adapter';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.models';

export class UserController {
    public get(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const user = new UserRepository().get(id);

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

    public create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const validateUserExist = new UserRepository().validateAlreadyExist(
                email
            );
            if (validateUserExist) {
                return ApiResponse.badRequest(
                    res,
                    `User already exists with email: ${email}`
                );
            }

            const user = new User(name, email, password);

            new UserRepository().create(user);

            return ApiResponse.success(
                res,
                'User was successfully created',
                user.toJson()
            );
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = new UserRepository().getByEmail(email);

        if (!user) {
            return ApiResponse.invalidCredentials(res);
        }

        if (user.password !== password) {
            return ApiResponse.invalidCredentials(res);
        }

        return ApiResponse.success(res, 'Login successfully done', {
            id: user.id,
            name: user.name,
        });
    }
}
