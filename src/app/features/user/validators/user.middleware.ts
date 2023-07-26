import { Request, NextFunction, Response } from 'express';
import { ApiResponse } from '../../../shared/util/http-response.adapter';

export class UserMiddleware {
    public static validateCreateFields(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { name, email, password, repeatPassword } = req.body;

            const validEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

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

            if (!email.match(validEmail)) {
                return ApiResponse.invalidField(res, 'Email');
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
            const validEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

            if (!email) {
                return ApiResponse.notProvided(res, 'Email');
            }
            if (!password) {
                return ApiResponse.notProvided(res, 'Password');
            }

            if (!email.match(validEmail)) {
                return ApiResponse.invalidField(res, 'Email');
            }

            next();
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
