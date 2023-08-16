import { User } from '../../../models/user.models';
import { Result } from '../../../shared/contracts/result.contract';
import { Return } from '../../../shared/util/return.adpter';
import { UserRepository } from '../repositories/user.repository';

interface CreateUserParams {
    name: string;
    email: string;
    password: string;
}

export class CreateUserUsecase {
    constructor(private userRepository: UserRepository) {}

    public async execute(params: CreateUserParams): Promise<Result> {
        const ValidIsRegistered = await this.userRepository.getByEmail(
            params.email
        );

        if (ValidIsRegistered) {
            return Return.badRequest('Email already registered');
        }

        const user = new User(params.name, params.email, params.password);
        this.userRepository.create(user);

        return Return.success('User successfully created', user.toJson());
    }
}
