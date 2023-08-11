import { title } from 'process';
import { Errand, ErrandStatus } from '../../../models/errand.models';
import { Result } from '../../../shared/contracts/result.contract';
import { CacheRepository } from '../../../shared/database/repositories/cache.repository';
import { Return } from '../../../shared/util/return.adpter';
import { ErrandRepository } from '../repositories/errand.repository';

export interface ListErrandsParams {
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
            const result = cachedErrands?.filter(
                (errand) =>
                    (!params.title || errand.title === params.title) &&
                    (!params.status || errand.status === params.status)
            );
            return Return.success('Errands successfully listed(cache)', result);
        }

        const errands = await new ErrandRepository().list({
            userId: params.userId,
            title: params.title?.toString(),
            status: params.status,
        });

        const result = errands.map((errand) => errand.toJson());

        if (result.length && !params.title && !params.status) {
            await cacheRepository.set(`errands-${params.userId}`, result);
        }

        return Return.success('Errands successfully listed', result);
    }
}
