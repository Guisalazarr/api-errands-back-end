import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { GetUserUsecase } from '../../../../../src/app/features/user/usecases/get-user.usecase';
import { User } from '../../../../../src/app/models/user.models';
import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';

describe('Testes unitários do get user usecase', () => {
    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    const user = new User('any_name', 'any_email', 'any_password,');

    function createSut() {
        const userRepository = new UserRepository();
        return new GetUserUsecase(userRepository);
    }

    test('deveria retornar not found quando o usuario nao existir', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(
            undefined
        );

        const result = await sut.execute('any_id');

        expect(result).toBeDefined();
        expect(result.code).toBe(404);
        expect(result.ok).toBe(false);
        expect(result.message).toEqual('User not found');
    });

    test('deveria sucesso se o usuario existir', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(user);

        const result = await sut.execute(user.id);

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('User successfully obtained');
        expect(result).toHaveProperty('data', user.toJson());
    });
});
