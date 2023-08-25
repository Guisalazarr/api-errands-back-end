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
    constructor(
        private userRepository: UserRepository,
        private errandRepository: ErrandRepository,
        private cacheRepository: CacheRepository
    ) {}

    public async execute(params: GetUserParams): Promise<Result> {
        const user = await this.userRepository.get(params.userId);
        if (!user) {
            return Return.notFound('User');
        }

        const cachedErrand = await this.cacheRepository.get(
            `errand-${params.errandId}`
        );

        if (cachedErrand) {
            return Return.success(
                'Errand succesfully obtained (cache)',
                cachedErrand
            );
        }

        const errand = await this.errandRepository.get(params.errandId);

        if (!errand) {
            return Return.notFound('Errand');
        }

        const result = errand.toJson();

        await this.cacheRepository.set(`errand-${params.errandId}`, result);

        return Return.success('Errand succesfully obtained', result);
    }
}
