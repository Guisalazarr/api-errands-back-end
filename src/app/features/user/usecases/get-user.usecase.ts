import { UserRepository } from '../repositories/user.repository';
import { Return } from '../../../shared/util/return.adpter';
import { Result } from '../../../shared/contracts/result.contract';

export class GetUserUsecase {
    public async execute(id: string): Promise<Result> {
        const respository = new UserRepository();
        const result = await respository.get(id);

        if (!result) {
            return Return.notFound('User');
        }

        return Return.success('User successfully obtained', result.toJson());
    }
}
