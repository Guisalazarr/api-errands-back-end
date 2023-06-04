import { Response } from 'express';

export class ApiResponse {
    // Bad Request ----------------------------------------
    public static notFound(res: Response, entity: string) {
        return res.status(404).send({
            ok: false,
            message: `${entity} was not found`,
        });
    }

    public static notProvided(res: Response, field: string) {
        return res.status(400).send({
            ok: false,
            message: `${field} was not provided`,
        });
    }

    public static invalidField(res: Response, field: string) {
        return res.status(400).send({
            ok: false,
            message: `${field} is invalid`,
        });
    }

    public static badRequest(res: Response, message: string) {
        return res.status(400).send({
            ok: false,
            message,
        });
    }

    public static serverError(res: Response, error: any) {
        return res.status(500).send({
            ok: false,
            error,
        });
    }

    // Sucess Request ------------------------------------------

    public static success(res: Response, message: string, data: any) {
        return res.status(200).send({
            ok: true,
            message,
            data,
        });
    }

    public static createSuccess(res: Response, entity: string, data: any) {
        return res.status(201).send({
            ok: true,
            messge: `${entity} created sucessfuly`,
            data,
        });
    }
}
