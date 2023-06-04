import { Request, NextFunction, Response } from 'express';
import { ApiResponse } from '../util/http-response.adapter';

export class ErrandMiddleware {
    public static validateCreateFields(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { title, description } = req.body;

            if (!title) {
                return ApiResponse.notProvided(res, 'Title');
            }
            if (!description) {
                return ApiResponse.notProvided(res, 'Description');
            }

            next();
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
