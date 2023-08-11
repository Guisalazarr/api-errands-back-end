import { ErrandStatus } from '../../../models/errand.models';
import { Result } from '../../../shared/contracts/result.contract';
import { CacheRepository } from '../../../shared/database/repositories/cache.repository';
import { Return } from '../../../shared/util/return.adpter';
import { UserRepository } from '../../user/repositories/user.repository';
import { ErrandRepository } from '../repositories/errand.repository';

export interface UpdateErrandsParams {
    userId: string;
    errandId: string;
    title?: string;
    description?: string;
    status?: ErrandStatus;
}

export class UpdateErrandsUseCase {
    public async execute(params: UpdateErrandsParams): Promise<Result> {
        const user = await new UserRepository().get(params.userId);

        if (!user) {
            return Return.notFound('User');
        }
        const errandRepository = new ErrandRepository();
        const errand = await errandRepository.get(params.errandId);

        if (!errand) {
            return Return.notFound('Errand');
        }

        if (params.title) {
            errand.title = params.title;
        }
        if (params.description) {
            errand.description = params.description;
        }
        if (params.status) {
            errand.status = params.status;
        }

        await errandRepository.update(errand);

        const cacheRepository = new CacheRepository();
        await cacheRepository.delete(`errands-${params.userId}`);
        await cacheRepository.delete(`errand-${params.errandId}`);

        const errands = await errandRepository.list({
            userId: user.id,
            status: ErrandStatus.unarchived,
        });

        const result = errands.map((errand) => errand.toJson());

        return Return.success('Errand successfully Edited', result);
    }
}
