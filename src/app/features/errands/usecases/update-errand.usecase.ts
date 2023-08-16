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
    constructor(
        private userRepository: UserRepository,
        private errandRepository: ErrandRepository,
        private cacheRepository: CacheRepository
    ) {}

    public async execute(params: UpdateErrandsParams): Promise<Result> {
        const user = await this.userRepository.get(params.userId);

        if (!user) {
            return Return.notFound('User');
        }

        const errand = await this.errandRepository.get(params.errandId);

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

        await this.errandRepository.update(errand);

        await this.cacheRepository.delete(`errands-${params.userId}`);
        await this.cacheRepository.delete(`errand-${params.errandId}`);

        const errands = await this.errandRepository.list({
            userId: user.id,
            status: ErrandStatus.unarchived,
        });

        const result = errands.map((errand) => errand.toJson());

        return Return.success('Errand successfully Edited', result);
    }
}
