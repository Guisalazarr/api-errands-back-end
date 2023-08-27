import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';
import { DeleteErrandUsecase } from '../../../../../src/app/features/errands/usecases/delete-errands.usecase';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { ErrandRepository } from '../../../../../src/app/features/errands/repositories/errand.repository';
import { CacheRepository } from '../../../../../src/app/shared/database/repositories/cache.repository';
import { User } from '../../../../../src/app/models/user.models';
import { Errand } from '../../../../../src/app/models/errand.models';
import { type } from 'os';

describe('Testes unitários do delete Errands usecase', () => {
    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();

        jest.spyOn(UserRepository.prototype, 'get').mockResolvedValue(user);
        jest.spyOn(CacheRepository.prototype, 'delete').mockResolvedValue();
        jest.spyOn(ErrandRepository.prototype, 'delete').mockResolvedValue(1);
        jest.spyOn(ErrandRepository.prototype, 'list').mockResolvedValue([
            errand,
        ]);
    });

    function createSut() {
        const userRepository = new UserRepository();
        const errandRepository = new ErrandRepository();
        const cacheRepository = new CacheRepository();
        return new DeleteErrandUsecase(
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

    test('deveria retornar 404 se o recado não existir', async () => {
        const sut = createSut();

        jest.spyOn(ErrandRepository.prototype, 'delete').mockResolvedValue(0);

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

    test('deveria retornar 200 e a lista de recados atualizada se o recado for deletado com sucesso', async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: user.id,
            errandId: errand.id,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(200);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('Errand successfully deleted');
        expect(result).toHaveProperty('data', [errand.toJson()]);
        expect(result.data).toHaveLength(1);
    });
});
