import { Result } from '../../../shared/contracts/result.contract';
import { Return } from '../../../shared/util/return.adpter';
import { UserRepository } from '../repositories/user.repository';

interface LoginParams {
    email: string;
    password: string;
}

export class LoginUsecase {
    public async execute(params: LoginParams): Promise<Result> {
        const user = await new UserRepository().getByEmail(params.email);
        if (!user) {
            return Return.invalidCredencials();
        }

        if (user.password !== params.password) {
            return Return.invalidCredencials();
        }

        return Return.success('Login successfully done', {
            id: user.id,
            name: user.name,
        });
    }
}
