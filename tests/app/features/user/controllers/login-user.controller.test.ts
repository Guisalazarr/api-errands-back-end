import request from 'supertest';
import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { createApp } from '../../../../../src/main/config//express.config';
import { UserEntity } from '../../../../../src/app/shared/database/entities/user.entity';
import { User } from '../../../../../src/app/models/user.models';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { ErrandEntity } from '../../../../../src/app/shared/database/entities/errand.entity';
import { LoginUsecase } from '../../../../../src/app/features/user/usecases/login-user.usecase';

describe('testando login de usuário', () => {
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

    const createSut = () => {
        return createApp();
    };

    const route = '/user/login';

    test('deveria retornar erro 400 se o email não for informado', async () => {
        const sut = createSut();
        const result = await request(sut).post(route).send();

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Email was not provided');
    });

    test('deveria retornar erro 400 se o password não for informado', async () => {
        const sut = createSut();
        const result = await request(sut).post(route).send({
            email: 'any_email@teste.com.br',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Password was not provided');
    });

    test('deveria retornar erro 400 se o email for inválido', async () => {
        const sut = createSut();
        const result = await request(sut).post(route).send({
            email: 'any_email',
            password: 'any_password',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Email is invalid');
    });

    test('deveria retornar erro 401 se o user não existir', async () => {
        const sut = createSut();
        const user = new User(
            'any_name',
            'any_email@teste.com',
            'any_password'
        );
        await createUser(user);

        const result = await request(sut).post(route).send({
            email: 'wrong_email@teste.com',
            password: 'any_password',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(401);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Unauthorized access');
    });

    test('deveria retornar erro 401 se a senha for incorreta', async () => {
        const sut = createSut();
        const user = new User(
            'any_name',
            'any_email@teste.com',
            'any_password'
        );
        await createUser(user);

        const result = await request(sut).post(route).send({
            email: 'any_email@teste.com',
            password: 'wrong_password',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(401);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Unauthorized access');
    });

    test('deveria retornar 200 se as credencias estiveram corretas', async () => {
        const sut = createSut();
        const user = new User(
            'any_name',
            'any_email@teste.com',
            'any_password'
        );
        await createUser(user);

        const result = await request(sut).post(route).send({
            email: 'any_email@teste.com',
            password: 'any_password',
        });

        expect(result).toBeDefined();
        expect(result.status).toBe(200);
        expect(result).toHaveProperty('body');

        expect(result.body).toHaveProperty('ok', true);
        expect(result.body.code).toBe(200);
        expect(result.body.message).toBe('Login successfully done');
    });

    test('deveria retornar 500 se o usecase disparar uma exceção', async () => {
        const sut = createSut();
        jest.spyOn(LoginUsecase.prototype, 'execute').mockRejectedValue(
            'Simulated Error'
        );
        const result = await request(sut).post(route).send({
            email: 'teste@teste.com',
            password: '12345',
        });

        expect(result).toBeDefined();
        expect(result.status).toEqual(500);
        expect(result).toHaveProperty('body');
        expect(result.body).toHaveProperty('ok', false);
        expect(result.body).toHaveProperty('message', 'Simulated Error');
        expect(result.body).not.toHaveProperty('data');
        expect(result.body).not.toHaveProperty('code');
    });
});
