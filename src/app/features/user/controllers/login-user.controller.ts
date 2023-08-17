import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { LoginUsecase } from '../usecases/login-user.usecase';
import { Request, Response } from 'express';

export class LoginUserController {
    constructor(private loginUsecase: LoginUsecase) {}

    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const result = await this.loginUsecase.execute(req.body);

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
