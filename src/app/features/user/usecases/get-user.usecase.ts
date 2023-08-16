import { UserRepository } from '../repositories/user.repository';
import { Return } from '../../../shared/util/return.adpter';
import { Result } from '../../../shared/contracts/result.contract';

export class GetUserUsecase {
    constructor(private userRepository: UserRepository) {}

    public async execute(id: string): Promise<Result> {
        const result = await this.userRepository.get(id);

        if (!result) {
            return Return.notFound('User');
        }

        return Return.success('User successfully obtained', result.toJson());
    }
}
