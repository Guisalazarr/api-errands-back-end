import { Result } from '../../../shared/contracts/result.contract';
import { CacheRepository } from '../../../shared/database/repositories/cache.repository';
import { Return } from '../../../shared/util/return.adpter';
import { UserRepository } from '../../user/repositories/user.repository';
import { ErrandRepository } from '../repositories/errand.repository';

interface GetUserParams {
    userId: string;
    errandId: string;
}

export class GetErrandUseCase {
    public async execute(params: GetUserParams): Promise<Result> {
        const user = await new UserRepository().get(params.userId);
        if (!user) {
            return Return.notFound('User');
        }

        const cacheRepository = new CacheRepository();
        const cachedErrand = await cacheRepository.get(
            `errands-${params.errandId}`
        );

        if (cachedErrand) {
            return Return.success(
                'Errand succesfully obtained (cache)',
                cachedErrand
            );
        }

        const errand = await new ErrandRepository().get(params.errandId);

        if (!errand) {
            return Return.notFound('Errand');
        }

        const result = errand.toJson();

        await cacheRepository.set(`errand-${params.errandId}`, result);

        return Return.success('Errands successfully listed', result);
    }
}
