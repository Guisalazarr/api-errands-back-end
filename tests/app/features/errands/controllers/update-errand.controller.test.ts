import request from 'supertest';
import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { UserEntity } from '../../../../../src/app/shared/database/entities/user.entity';
import { ErrandEntity } from '../../../../../src/app/shared/database/entities/errand.entity';
import { User } from '../../../../../src/app/models/user.models';
import { createApp } from '../../../../../src/main/config/express.config';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { JwtService } from '../../../../../src/app/shared/service/jwt.service';
import { Errand } from '../../../../../src/app/models/errand.models';
import { ErrandRepository } from '../../../../../src/app/features/errands/repositories/errand.repository';
import { UpdateErrandsUseCase } from '../../../../../src/app/features/errands/usecases/update-errand.usecase';

describe('Testando edição do recado', () => {
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

    const createErrand = async (errand: Errand) => {
        const repository = new ErrandRepository();
        await repository.create(errand);
    };

    const createSut = () => {
        return createApp();
    };

    const user = new User('any_name', 'any_email.com', 'any_password');
    const errand = new Errand('any_name', 'any_description', user);
    const errand2 = new Errand('any_name2', 'any_description2', user);
    const token = new JwtService().createToken(user.toJson());

    const route = `/user/${user.id}/errand/${errand.id}`;

    test('deveria retornar erro 401 se o token não for informado', async () => {
        const sut = createSut();
        const result = await request(sut).put(route).send();

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(401);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Unauthorized access');
    });

    test('deveria retornar erro 401 se o token for informado inválido', async () => {
        const sut = createSut();
        const result = await request(sut)
            .put(route)
            .set('Authorization', '1234')
            .send();

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(401);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Unauthorized access');
        expect(result.body).not.toHaveProperty('data');
    });

    test('deveria retornar erro 404 se o user não for localizado', async () => {
        const sut = createSut();

        const result = await request(sut)
            .put(route)
            .set('Authorization', token)
            .send({
                title: 'any_title',
                description: 'any_description',
            });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(404);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('User not found');
    });

    test('deveria retornar erro 404 se o recado não for localizado', async () => {
        const sut = createSut();
        await createUser(user);
        const result = await request(sut)
            .put(route)
            .set('Authorization', token)
            .send();

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(404);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Errand not found');
    });

    test('deveria retornar erro 400 se tipo do status for inválido', async () => {
        const sut = createSut();
        await createUser(user);
        await createErrand(errand);
        const result = await request(sut)
            .put(route)
            .set('Authorization', token)
            .send({
                status: 'I',
            });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(false);
        expect(result.body.message).toBe('Status is invalid');
    });

    test('deveria retornar 200 se o recado for editado com sucesso', async () => {
        const sut = createSut();
        await createUser(user);
        await createErrand(errand);
        await createErrand(errand2);

        const result = await request(sut)
            .put(route)
            .set('Authorization', token)
            .send({
                title: 'any_title',
                descrption: 'any_description',
                status: 'A',
            });

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.status).toBe(200);
        expect(result).toHaveProperty('body.ok');
        expect(result.body.ok).toBe(true);
        expect(result.body.message).toBe('Errand successfully Edited');
        expect(result.body).toHaveProperty('data', [errand2.toJson()]);
    });

    test('deveria retornar 500 se o usecase disparar uma exceção', async () => {
        const sut = createSut();

        jest.spyOn(UpdateErrandsUseCase.prototype, 'execute').mockRejectedValue(
            'Simulated Error'
        );
        const result = await request(sut)
            .put(route)
            .set('Authorization', token)
            .send();

        expect(result).toBeDefined();
        expect(result.status).toEqual(500);
        expect(result).toHaveProperty('body');
        expect(result.body).toHaveProperty('ok', false);
        expect(result.body).toHaveProperty('message', 'Simulated Error');
        expect(result.body).not.toHaveProperty('data');
        expect(result.body).not.toHaveProperty('code');
    });
});
