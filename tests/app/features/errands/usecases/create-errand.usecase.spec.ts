import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { CreateErrandUsecase } from '../../../../../src/app/features/errands/usecases/create-errand.usecase';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { ErrandRepository } from '../../../../../src/app/features/errands/repositories/errand.repository';
import { CacheRepository } from '../../../../../src/app/shared/database/repositories/cache.repository';
import { User } from '../../../../../src/app/models/user.models';
import { Errand } from '../../../../../src/app/models/errand.models';

describe('Testes unitários do create Errand usecase', () => {
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
        return new CreateErrandUsecase(
            userRepository,
            errandRepository,
            cacheRepository
        );
    }

    const user = new User('any_name', 'any_email', 'any_password');

    test('deveria retornar 404 se o usuário não existir', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(
            undefined
        );

        const result = await sut.execute({
            userId: user.id,
            title: 'any_title',
            description: 'any_description',
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(404);
        expect(result.ok).toBe(false);
        expect(result.message).toEqual('User not found');
        expect(result).not.toHaveProperty('data');
    });

    test('deveria retornar 201 se o recado for cadastrado com sucesso', async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(user);
        jest.spyOn(ErrandRepository.prototype, 'create').mockResolvedValue();
        jest.spyOn(CacheRepository.prototype, 'delete').mockResolvedValue();

        const errand = new Errand('any_title', 'any_description', user);

        const result = await sut.execute({
            userId: user.id,
            title: errand.title,
            description: errand.description,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(201);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errand created successfully');

        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('title', errand.title);
        expect(result.data).toHaveProperty('description', errand.description);
        expect(result.data).toHaveProperty('status', errand.status);
    });
});
