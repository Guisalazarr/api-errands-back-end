import { Result } from '../contracts/result.contract';

export class Return {
    public static invalidCredencial(): Result {
        return {
            ok: false,
            message: 'Unauthorized access',
            code: 401,
        };
    }

    public static notFound(entity: string): Result {
        return {
            ok: false,
            message: `${entity} not found`,
            code: 404,
        };
    }

    public static badRequest(message: string): Result {
        return {
            ok: false,
            message,
            code: 400,
        };
    }

    public static success(message: string, data: any): Result {
        return {
            ok: true,
            message,
            data,
            code: 200,
        };
    }
}
