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
    constructor(
        private userRepository: UserRepository,
        private errandRepository: ErrandRepository,
        private cacheRepository: CacheRepository
    ) {}

    public async execute(params: DeleteErrandsParams): Promise<Result> {
        const user = await this.userRepository.get(params.userId);
        if (!user) {
            return Return.notFound('User');
        }

        const errandDeleted = await this.errandRepository.delete(
            params.errandId
        );

        if (errandDeleted == 0) {
            return Return.notFound('Errand');
        }

        await this.cacheRepository.delete(`errands-${params.userId}`);
        await this.cacheRepository.delete(`errand-${params.errandId}`);

        const result = await this.errandRepository.list({
            userId: user.id,
            status: ErrandStatus.unarchived,
        });

        return Return.success(
            'Errand successfully deleted',
            result.map((errand) => errand.toJson())
        );
    }
}
