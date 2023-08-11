import { ErrandStatus } from '../../../models/errand.models';
import { Result } from '../../../shared/contracts/result.contract';
import { CacheRepository } from '../../../shared/database/repositories/cache.repository';
import { Return } from '../../../shared/util/return.adpter';
import { UserRepository } from '../../user/repositories/user.repository';
import { ErrandRepository } from '../repositories/errand.repository';

interface DeleteErrandsParams {
    userId: string;
    errandId: string;
}

export class DeleteErrandUsecase {
    public async execute(params: DeleteErrandsParams): Promise<Result> {
        const user = await new UserRepository().get(params.userId);
        if (!user) {
            return Return.notFound('User');
        }

        const errandRepository = new ErrandRepository();
        const errandDeleted = await errandRepository.delete(params.errandId);

        if (errandDeleted == 0) {
            return Return.notFound('Errand');
        }

        const cacheRepository = new CacheRepository();
        await cacheRepository.delete(`errands-${params.userId}`);
        await cacheRepository.delete(`errand-${params.errandId}`);

        const result = await errandRepository.list({
            userId: user.id,
            status: ErrandStatus.unarchived,
        });

        return Return.success(
            'Errand successfully deleted',
            result.map((errand) => errand.toJson())
        );
    }
}
