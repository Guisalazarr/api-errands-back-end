import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { JwtService } from '../../../shared/service/jwt.service';
export class LoginValidator {
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

    public static checkToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return ApiResponse.invalidCredentials(res);
            }

            const jwtService = new JwtService();
            const isValid = jwtService.verifyToken(token);

            if (!isValid) {
                return ApiResponse.invalidCredentials(res);
            }

            next();
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                error: error.toString(),
            });
        }
    }
}
