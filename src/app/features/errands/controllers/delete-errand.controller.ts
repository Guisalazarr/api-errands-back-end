import { ErrandStatus } from '../../../models/errand.models';
import { ApiResponse } from '../../../shared/util/http-response.adapter';
import { Request, Response } from 'express';
import { ListErrandsUseCase } from '../usecases/list-errands.usecase';
import { GetErrandUseCase } from '../usecases/get-errand.usecase';
import { CreateErrandUsecase } from '../usecases/create-errand.usecase';
import { DeleteErrandUsecase } from '../usecases/delete-errands.usecase';
import { UpdateErrandsUseCase } from '../usecases/update-errand.usecase';

export class DeleteErrandController {
    constructor(private deleteUsecase: DeleteErrandUsecase) {}

    public async delete(req: Request, res: Response) {
        try {
            const { id, errandId } = req.params;

            const result = await this.deleteUsecase.execute({
                userId: id,
                errandId,
            });

            return res.status(result.code).send(result);
        } catch (error: any) {
            return ApiResponse.serverError(res, error);
        }
    }
}
