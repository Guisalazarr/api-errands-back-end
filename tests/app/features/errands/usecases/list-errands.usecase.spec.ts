import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { ListErrandsUseCase } from '../../../../../src/app/features/errands/usecases/list-errands.usecase';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { ErrandRepository } from '../../../../../src/app/features/errands/repositories/errand.repository';
import { CacheRepository } from '../../../../../src/app/shared/database/repositories/cache.repository';
import { User } from '../../../../../src/app/models/user.models';
import { Errand } from '../../../../../src/app/models/errand.models';

describe('Testes unitários do list Errands usecase', () => {
    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(user);
        jest.spyOn(ErrandRepository.prototype, 'list').mockResolvedValue(
            errands
        );
        jest.spyOn(CacheRepository.prototype, 'get').mockResolvedValue(errands);
        jest.spyOn(CacheRepository.prototype, 'set').mockResolvedValue();
    });

    function createSut() {
        const userRepository = new UserRepository();
        const errandRepository = new ErrandRepository();
        const cacheRepository = new CacheRepository();
        return new ListErrandsUseCase(
            userRepository,
            errandRepository,
            cacheRepository
        );
    }

    const user = new User('any_name', 'any_email', 'any_password');
    const errand = new Errand('any_title', 'any_description', user);
    const errands = [errand];

    test('deveria retornar usuário não encontrado se o usuário não foi localizado', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(
            undefined
        );

        const result = await sut.execute({
            userId: 'any_id',
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(404);
        expect(result.ok).toBe(false);
        expect(result.message).toEqual('User not found');
        expect(result).not.toHaveProperty('data');
    });

    test('deveria retornar sucesso e indicação de cache se houve cache para a lista de recados', async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: user.id,
            title: errand.title,
            status: errand.status,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errands successfully listed(cache)');
        expect(result).toHaveProperty('data', errands);
    });

    test('deveria retornar sucesso sem indicação de cache se não houve cache para a lista de recados', async () => {
        const sut = createSut();

        jest.spyOn(CacheRepository.prototype, 'get').mockResolvedValue(null);
        jest.spyOn(ErrandRepository.prototype, 'list').mockResolvedValue([]);

        const result = await sut.execute({ userId: user.id });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errands successfully listed');
        expect(result).toHaveProperty('data', []);
        expect(result.data).toHaveLength(0);
    });

    test('deveria retornar sucesso e 1 de recado cadastrado', async () => {
        const sut = createSut();

        jest.spyOn(CacheRepository.prototype, 'get').mockResolvedValue(null);

        const result = await sut.execute({ userId: user.id });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errands successfully listed');
        expect(result).toHaveProperty(
            'data',
            errands.map((errand) => errand.toJson())
        );
        expect(result.data).toHaveLength(1);
    });
});
