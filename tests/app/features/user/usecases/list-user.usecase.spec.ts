import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { ListUserUsecase } from '../../../../../src/app/features/user/usecases/list-user.usecase';
import { User } from '../../../../../src/app/models/user.models';

import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';

describe('Testes unitários do list user usecase', () => {
    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    function createSut() {
        const userRepository = new UserRepository();
        return new ListUserUsecase(userRepository);
    }

    test('deveria retornar sucesso e uma lista vazia se não houver nenhum usuário cadastrado', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'list').mockResolvedValue([]);

        const result = await sut.execute();

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result).toHaveProperty('message', 'Users successully listed');
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveLength(0);
    });

    test('deveria retornar sucesso e uma lista com 2 usuários cadastrados', async () => {
        const sut = createSut();

        const user = new User('any_name', 'any_email', 'any_password');
        const user2 = new User('any_name2', 'any_email2', 'any_password2');

        jest.spyOn(UserRepository.prototype, 'list').mockResolvedValue([
            user,
            user2,
        ]);

        const result = await sut.execute();

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result).toHaveProperty('message', 'Users successully listed');
        expect(result).toHaveProperty('data', [user.toJson(), user2.toJson()]);
        expect(result.data).toHaveLength(2);
    });
});
