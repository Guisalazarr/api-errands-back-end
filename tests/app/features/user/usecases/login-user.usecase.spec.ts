import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { LoginUsecase } from '../../../../../src/app/features/user/usecases/login-user.usecase';
import { User } from '../../../../../src/app/models/user.models';
import { JwtService } from '../../../../../src/app/shared/service/jwt.service';
import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';

describe('Testes unitários do login user usecase', () => {
    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();

        jest.spyOn(UserRepository.prototype, 'getByEmail').mockResolvedValue(
            user
        );
    });

    const user = new User('any_name', 'any_email', 'any_password');

    function createSut() {
        const userRepository = new UserRepository();
        return new LoginUsecase(userRepository);
    }

    test('deveria retornar acesso não autorizado se o usuário não existir', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'getByEmail').mockResolvedValue(
            undefined
        );

        const result = await sut.execute({
            email: 'any_email',
            password: 'any_password',
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(401);
        expect(result.ok).toBe(false);
        expect(result.message).toEqual('Unauthorized access');
    });

    test('deveria retornar acesso não autorizado se a senha estiver incorreta', async () => {
        const sut = createSut();

        const result = await sut.execute({
            email: 'any_email',
            password: 'wrong_password',
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(401);
        expect(result.ok).toBe(false);
        expect(result.message).toEqual('Unauthorized access');
    });

    test('deveria retornar sucesso se as credenciais estiverem corretas', async () => {
        const sut = createSut();

        const token = new JwtService().createToken(user.toJson());

        const result = await sut.execute({
            email: 'any_email',
            password: 'any_password',
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Login successfully done');
        expect(result.data).toHaveProperty('id', user.id);
        expect(result.data).toHaveProperty('token', token);
    });
});
