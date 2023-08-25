import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { createApp } from '../../../../../src/main/config//express.config';
import supertest from 'supertest';
import { UserEntity } from '../../../../../src/app/shared/database/entities/user.entity';

describe('testando criação de usuário', () => {
    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });

    beforeEach(async () => {
        const repository = Database.connection.getRepository(UserEntity);
        await repository.clear();
    });

    afterAll(async () => {
        await Database.connection.destroy();
        await CacheDatabase.connection.quit();
    });

    const sut = createApp();

    test('deveria retornar erro 400 se o name não for informado', async () => {
        const result = await supertest(sut).post('/user').send();

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Name was not provided');
    });

    test('deveria retornar erro 400 se o email não for informado', async () => {
        const result = await supertest(sut).post('/user').send({
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
        const result = await supertest(sut).post('/user').send({
            name: 'any_name',
            email: 'any_email',
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Password was not provided');
    });
    test('deveria retornar erro 400 se o email for informado inválido', async () => {
        const result = await supertest(sut).post('/user').send({
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
        const result = await supertest(sut).post('/user').send({
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
        const result = await supertest(sut).post('/user').send({
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

    test('deveria retornar erro 400 se as senhas forem divergentes', async () => {
        const result = await supertest(sut).post('/user').send({
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
});
