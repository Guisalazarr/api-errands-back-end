import { Errand } from '../../../models/errand.models';
import { User } from '../../../models/user.models';
import { Result } from '../../../shared/contracts/result.contract';
import { CacheRepository } from '../../../shared/database/repositories/cache.repository';
import { Return } from '../../../shared/util/return.adpter';
import { UserRepository } from '../../user/repositories/user.repository';
import { ErrandRepository } from '../repositories/errand.repository';

interface CreateErrandsParams {
    userId: string;
    title: string;
    description: string;
}

export class CreateErrandUsecase {
    constructor(
        private userRepository: UserRepository,
        private errandRepository: ErrandRepository,
        private cacheRepository: CacheRepository
    ) {}

    public async execute(params: CreateErrandsParams): Promise<Result> {
        const user = await this.userRepository.get(params.userId);
        if (!user) {
            return Return.notFound('User');
        }

        const errand = new Errand(params.title, params.description, user);
        await this.errandRepository.create(errand);

        await this.cacheRepository.delete(`errands-${params.userId}`);

        return Return.create('Errand', errand.toJson());
    }
}
