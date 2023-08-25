import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { GetErrandUseCase } from '../../../../../src/app/features/errands/usecases/get-errand.usecase';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { ErrandRepository } from '../../../../../src/app/features/errands/repositories/errand.repository';
import { CacheRepository } from '../../../../../src/app/shared/database/repositories/cache.repository';
import { User } from '../../../../../src/app/models/user.models';
import { Errand } from '../../../../../src/app/models/errand.models';

describe('Testes unitários do get Errands usecase', () => {
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
        const errandRepository = new ErrandRepository();
        const cacheRepository = new CacheRepository();
        return new GetErrandUseCase(
            userRepository,
            errandRepository,
            cacheRepository
        );
    }

    const user = new User('any_name', 'any_email', 'any_password');
    const errand = new Errand('any_title', 'any_description', user);

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

    test('deveria retornar 200 e indicação de cache se houver cache para a o recado', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(user);
        jest.spyOn(CacheRepository.prototype, 'get').mockResolvedValue([
            errand,
        ]);

        const result = await sut.execute({
            userId: user.id,
            errandId: errand.id,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errand succesfully obtained (cache)');
        expect(result).toHaveProperty('data', [errand]);
        expect(result.data).toHaveLength(1);
    });

    test('deveria retornar 404 se o recado não foi encontrado', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(user);
        jest.spyOn(ErrandRepository.prototype, 'get').mockResolvedValue(
            undefined
        );
        jest.spyOn(CacheRepository.prototype, 'get').mockResolvedValue(null);

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

    test('deveria retornar 200 se o recado for encontrado', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(user);
        jest.spyOn(ErrandRepository.prototype, 'get').mockResolvedValue(errand);
        jest.spyOn(CacheRepository.prototype, 'get').mockResolvedValue(null);
        jest.spyOn(CacheRepository.prototype, 'set').mockResolvedValue();

        const result = await sut.execute({
            userId: user.id,
            errandId: errand.id,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errand succesfully obtained');
        expect(result).toHaveProperty('data', errand.toJson());
    });
});
