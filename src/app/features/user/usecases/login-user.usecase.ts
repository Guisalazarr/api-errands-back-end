import { Result } from '../../../shared/contracts/result.contract';
import { JwtService } from '../../../shared/service/jwt.service';
import { Return } from '../../../shared/util/return.adpter';
import { UserRepository } from '../repositories/user.repository';

interface LoginParams {
    email: string;
    password: string;
}

export class LoginUsecase {
    constructor(private userRepository: UserRepository) {}
    public async execute(params: LoginParams): Promise<Result> {
        const user = await new UserRepository().getByEmail(params.email);
        if (!user) {
            return Return.invalidCredencials();
        }

        if (user.password !== params.password) {
            return Return.invalidCredencials();
        }

        const token = new JwtService().createToken(user.toJson());

        return Return.success('Login successfully done', {
            id: user.id,
            token: token,
        });
    }
}
