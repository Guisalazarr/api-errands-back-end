import { Request, NextFunction, Response } from 'express';
import { ApiResponse } from '../../../shared/util/http-response.adapter';

export class UserValidator {
    public static validateCreateFields(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { name, email, password } = req.body;

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

            if (!email.match(validEmail)) {
                return ApiResponse.invalidField(res, 'Email');
            }

            next();
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }

    public static validatePassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { password, repeatPassword } = req.body;

            if (!password) {
                return ApiResponse.notProvided(res, 'Password');
            }

            if (password.length < 4) {
                return ApiResponse.badRequest(
                    res,
                    'Password must be at least 4 characters'
                );
            }

            if (password.length > 12) {
                return ApiResponse.badRequest(
                    res,
                    'Password must be at most minus 12 characters'
                );
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
}
