import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { UpdateErrandsUseCase } from '../../../../../src/app/features/errands/usecases/update-errand.usecase';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { ErrandRepository } from '../../../../../src/app/features/errands/repositories/errand.repository';
import { CacheRepository } from '../../../../../src/app/shared/database/repositories/cache.repository';
import { User } from '../../../../../src/app/models/user.models';
import {
    Errand,
    ErrandStatus,
} from '../../../../../src/app/models/errand.models';

describe('Testes unitários do update Errand usecase', () => {
    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(user);
        jest.spyOn(ErrandRepository.prototype, 'get').mockResolvedValue(errand);

        jest.spyOn(ErrandRepository.prototype, 'list').mockResolvedValue(
            errands
        );
        jest.spyOn(CacheRepository.prototype, 'delete').mockResolvedValue();
    });

    function createSut() {
        const userRepository = new UserRepository();
        const errandRepository = new ErrandRepository();
        const cacheRepository = new CacheRepository();
        return new UpdateErrandsUseCase(
            userRepository,
            errandRepository,
            cacheRepository
        );
    }

    const user = new User('any_name', 'any_email', 'any_password');
    const errand = new Errand('any_title', 'any_description', user);
    const errands = [errand];

    test('deveria retornar 404 se o usuário não foi localizado', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(
            undefined
        );

        const result = await sut.execute({
            userId: user.id,
            errandId: errand.id,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(404);
        expect(result.ok).toBe(false);
        expect(result.message).toEqual('User not found');
        expect(result).not.toHaveProperty('data');
    });

    test('deveria retornar 404 se o recado não existir', async () => {
        const sut = createSut();

        jest.spyOn(ErrandRepository.prototype, 'get').mockResolvedValue(
            undefined
        );

        const result = await sut.execute({
            userId: user.id,
            errandId: errand.id,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(404);
        expect(result.ok).toBe(false);
        expect(result.message).toEqual('Errand not found');
        expect(result).not.toHaveProperty('data');
    });

    test('deveria retornar 200 caso passe em todas as validações, sem informar os paremetros opcionais', async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: user.id,
            errandId: errand.id,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errand successfully Edited');
        expect(result).toHaveProperty(
            'data',
            errands.map((errand) => errand.toJson())
        );
    });

    test('deveria retornar 200 caso passe em todas as validações e informe novo title', async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: user.id,
            errandId: errand.id,
            title: 'new_title',
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errand successfully Edited');
        expect(result).toHaveProperty(
            'data',
            errands.map((errand) => errand.toJson())
        );
    });

    test('deveria retornar 200 caso passe em todas as validações e informe nova description', async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: user.id,
            errandId: errand.id,
            description: 'new_description',
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errand successfully Edited');
        expect(result).toHaveProperty(
            'data',
            errands.map((errand) => errand.toJson())
        );
    });

    test('deveria retornar 200 caso passe em todas as validações e informe novo status', async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: user.id,
            errandId: errand.id,
            status: ErrandStatus.archived,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errand successfully Edited');
        expect(result).toHaveProperty(
            'data',
            errands.map((errand) => errand.toJson())
        );
    });

    test('deveria retornar 200 caso passe em todas as validações e informe todos os parametros', async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: user.id,
            errandId: errand.id,
            title: 'new_title',
            description: 'new_description',
            status: ErrandStatus.archived,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errand successfully Edited');
        expect(result).toHaveProperty(
            'data',
            errands.map((errand) => errand.toJson())
        );
    });
});
