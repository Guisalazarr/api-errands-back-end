import request from 'supertest';
import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { UserEntity } from '../../../../../src/app/shared/database/entities/user.entity';
import { ErrandEntity } from '../../../../../src/app/shared/database/entities/errand.entity';
import { User } from '../../../../../src/app/models/user.models';
import { createApp } from '../../../../../src/main/config/express.config';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { GetUserUsecase } from '../../../../../src/app/features/user/usecases/get-user.usecase';

describe('Testando busca de usuário por ID', () => {
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
    const user = new User('any_name', 'any_email@teste.com', 'any_password');
    const route = `/user/${user.id}`;

    test('deveria retornar erro 404 se o user não for localizado', async () => {
        const result = await request(sut).get(route).send();

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(404);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('User not found');
    });

    test('deveria retornar 200 se o usuário for localizado', async () => {
        await createUser(user);

        const result = await request(sut).get(route).send();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.status).toBe(200);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(true);
        expect(result.body.message).toBe('User successfully obtained');
        expect(result.body).toHaveProperty('data', user.toJson());
    });

    test('deveria retornar 500 se o usecase disparar uma exceção', async () => {
        jest.spyOn(GetUserUsecase.prototype, 'execute').mockRejectedValue(
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
