import { Return } from '../../../shared/util/return.adpter';
import { UserRepository } from '../repositories/user.repository';
import { Result } from '../../../shared/contracts/result.contract';

export class ListUserUsecase {
    public async execute(): Promise<Result> {
        const repository = new UserRepository();
        const result = await repository.list();

        return Return.success(
            'User successfully obtained',
            result.map((user) => user.toJson())
        );
    }
}
