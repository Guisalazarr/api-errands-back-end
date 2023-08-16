import { Return } from '../../../shared/util/return.adpter';
import { UserRepository } from '../repositories/user.repository';
import { Result } from '../../../shared/contracts/result.contract';

export class ListUserUsecase {
    constructor(private userRepository: UserRepository) {}
    public async execute(): Promise<Result> {
        const result = await this.userRepository.list();

        return Return.success(
            'User successfully obtained',
            result.map((user) => user.toJson())
        );
    }
}
