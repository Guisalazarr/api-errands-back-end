import request from 'supertest';
import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { UserEntity } from '../../../../../src/app/shared/database/entities/user.entity';
import { ErrandEntity } from '../../../../../src/app/shared/database/entities/errand.entity';
import { User } from '../../../../../src/app/models/user.models';
import { createApp } from '../../../../../src/main/config/express.config';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { ListUserUsecase } from '../../../../../src/app/features/user/usecases/list-user.usecase';

describe('Testando listagem de usuário', () => {
    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });

    beforeEach(async () => {
        const database = Database.connection;
        const userRepository = database.getRepository(UserEntity);
        const errandRepository = database.getRepository(ErrandEntity);

        await errandRepository.clear();
        await userRepository.clear();

        const cache = CacheDatabase.connection;
        await cache.flushall();
    });

    afterAll(async () => {
        await Database.connection.destroy();
        await CacheDatabase.connection.quit();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    const createUser = async (user: User) => {
        const repository = new UserRepository();
        await repository.create(user);
    };
    const sut = createApp();
    const route = '/user';
    const user1 = new User('any_name', 'any_email@teste.com', 'any_password');
    const user2 = new User(
        'any_name2',
        'any2_email@teste.com',
        'any_password2'
    );

    test('deveria retornar sucesso e o uma lista com 2 usuários', async () => {
        await createUser(user1);
        await createUser(user2);

        const result = await request(sut).get(route).send();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.status).toBe(200);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(true);
        expect(result.body.message).toBe('Users successully listed');
        expect(result.body).toHaveProperty('data', [
            user1.toJson(),
            user2.toJson(),
        ]);
    });

    test('deveria retornar 500 se o usecase disparar uma exceção', async () => {
        jest.spyOn(ListUserUsecase.prototype, 'execute').mockRejectedValue(
            'Simulated Error'
        );
        const result = await request(sut).get(route).send();

        expect(result).toBeDefined();
        expect(result.status).toEqual(500);
        expect(result).toHaveProperty('body');
        expect(result.body).toHaveProperty('ok', false);
        expect(result.body).toHaveProperty('message', 'Simulated Error');
        expect(result.body).not.toHaveProperty('data');
        expect(result.body).not.toHaveProperty('code');
    });
});
