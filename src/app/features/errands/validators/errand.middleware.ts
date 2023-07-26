import { Request, NextFunction, Response } from 'express';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { ErrandStatus } from '../../../models/errand.models';

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

    public static validateStatusErrand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { status } = req.body;

            const allowedType = Object.values(ErrandStatus);

            if (!allowedType.includes(status) && status !== undefined) {
                return ApiResponse.invalidField(res, 'Status');
            }

            next();
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
