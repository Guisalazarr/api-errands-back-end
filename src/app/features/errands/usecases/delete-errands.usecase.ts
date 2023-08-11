import { Errand, ErrandStatus } from '../../../models/errand.models';
import { User } from '../../../models/user.models';
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

        const errandDeleted = await new ErrandRepository().delete(
            params.errandId
        );

        if (errandDeleted == 0) {
            return Return.notFound('Errand');
        }

        await new CacheRepository().delete(`errands-${params.userId}`);
        await new CacheRepository().delete(`errand-${params.errandId}`);

        const result = await new ErrandRepository().list({
            userId: user.id,
            status: ErrandStatus.unarchived,
        });

        return Return.success(
            'Errand successfully deleted',
            result.map((errand) => errand.toJson())
        );
    }
}
