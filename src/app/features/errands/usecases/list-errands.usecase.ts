import { ErrandStatus } from '../../../models/errand.models';
import { Result } from '../../../shared/contracts/result.contract';
import { CacheRepository } from '../../../shared/database/repositories/cache.repository';
import { Return } from '../../../shared/util/return.adpter';
import { ErrandRepository } from '../repositories/errand.repository';

interface ListErrandsParams {
    userId: string;
    title?: string;
    status?: ErrandStatus;
}

export class ListErrandsUseCase {
    public async execute(params: ListErrandsParams): Promise<Result> {
        const cacheRepository = new CacheRepository();
        const cachedErrands = await cacheRepository.get(
            `errands-${params.userId}`
        );

        if (cachedErrands) {
            return Return.success(
                'Errands succesfully listed (cache)',
                cachedErrands
            );
        }

        const errands = await new ErrandRepository().list({
            userId: params.userId,
            title: params.title?.toString(),
            status: params.status,
        });

        const result = errands.map((errand) => errand.toJson());

        await cacheRepository.set(`errands-${params.userId}`, result);

        return Return.success('Errands successfully listed', result);
    }
}
