import { Request, NextFunction, Response } from 'express';
import { ApiResponse } from '../util/http-response.adapter';

export class UserMiddleware {
    public static validateCreateFields(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { name, email, password, repeatPassword } = req.body;

            if (!name) {
                return ApiResponse.notProvided(res, 'Name');
            }
            if (!email) {
                return ApiResponse.notProvided(res, 'Email');
            }
            if (!password) {
                return ApiResponse.notProvided(res, 'Password');
            }
            if (!repeatPassword) {
                return ApiResponse.notProvided(res, 'Repeat Password');
            }
            if (password !== repeatPassword) {
                return ApiResponse.badRequest(
                    res,
                    'The passwords were not match'
                );
            }

            next();
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
    public static validateFieldsLogin(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { email, password } = req.body;

            if (!email) {
                return ApiResponse.notProvided(res, 'Email');
            }
            if (!password) {
                return ApiResponse.notProvided(res, 'Password');
            }

            next();
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
