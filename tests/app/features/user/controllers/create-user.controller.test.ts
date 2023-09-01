import request from 'supertest';
import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { UserEntity } from '../../../../../src/app/shared/database/entities/user.entity';
import { ErrandEntity } from '../../../../../src/app/shared/database/entities/errand.entity';
import { User } from '../../../../../src/app/models/user.models';
import { createApp } from '../../../../../src/main/config/express.config';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { CreateUserUsecase } from '../../../../../src/app/features/user/usecases/create-user.usecase';

describe('Testando criação de usuário', () => {
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
    const route = '/user';

    test('deveria retornar erro 400 se o name não for informado', async () => {
        const sut = createSut();
        const result = await request(sut).post(route).send();

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Name was not provided');
    });

    test('deveria retornar erro 400 se o email não for informado', async () => {
        const sut = createSut();
        const result = await request(sut).post(route).send({
            name: 'any_name',
        });

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
            name: 'any_name',
            email: 'any_email@teste.com',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Password was not provided');
    });
    test('deveria retornar erro 400 se o email for informado inválido', async () => {
        const sut = createSut();
        const result = await request(sut).post(route).send({
            name: 'any_name',
            email: 'any_email.com',
            password: '1234',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Email is invalid');
    });

    test('deveria retornar erro 400 se o password menor que 4', async () => {
        const sut = createSut();
        const result = await request(sut).post(route).send({
            name: 'any_name',
            email: 'any_email@any.com',
            password: '123',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe(
            'Password must be at least 4 characters'
        );
    });

    test('deveria retornar erro 400 se o password for maior que 12', async () => {
        const sut = createSut();
        const result = await request(sut).post(route).send({
            name: 'any_name',
            email: 'any_email@any.com',
            password: '123456789101112',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe(
            'Password must be at most minus 12 characters'
        );
    });

    test('deveria retornar erro 400 se as o repeat Password não for informado', async () => {
        const sut = createSut();
        const result = await request(sut).post(route).send({
            name: 'any_name',
            email: 'any_email@any.com',
            password: 'any_password',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Repeat Password was not provided');
    });

    test('deveria retornar erro 400 se as senhas forem divergentes', async () => {
        const sut = createSut();
        const result = await request(sut).post(route).send({
            name: 'any_name',
            email: 'any_email@any.com',
            password: 'any_password',
            repeatPassword: 'wrong_password',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('The passwords were not match');
    });

    test('deveria retornar erro 400 se o email já está cadastrado', async () => {
        const sut = createSut();
        const user = new User(
            'any_name',
            'any_email@teste.com',
            'any_password'
        );
        await createUser(user);
        const result = await request(sut).post(route).send({
            name: 'any_name',
            email: 'any_email@teste.com',
            password: 'any_password',
            repeatPassword: 'any_password',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Email already registered');
    });

    test('deveria retornar 201 se o usuário for cadastrado com sucesso', async () => {
        const sut = createSut();
        const user = new User(
            'any_name',
            'any_email@teste.com',
            'any_password'
        );
        await createUser(user);

        const result = await request(sut).post(route).send({
            name: 'newUser',
            email: 'newemail@teste.com',
            password: '12345',
            repeatPassword: '12345',
        });
        expect(result).toBeDefined();
        expect(result.status).toEqual(201);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(true);
        expect(result.body.message).toBe('User created successfully');
        expect(result.body).toHaveProperty('data');
    });

    test('deveria retornar 500 se o usecase disparar uma exceção', async () => {
        const sut = createSut();
        jest.spyOn(CreateUserUsecase.prototype, 'execute').mockRejectedValue(
            'Simulated Error'
        );
        const result = await request(sut).post(route).send({
            name: 'newUser',
            email: 'newemail@teste.com',
            password: '12345',
            repeatPassword: '12345',
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
