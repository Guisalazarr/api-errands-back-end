import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { CreateUserUsecase } from '../../../../../src/app/features/user/usecases/create-user.usecase';
import { User } from '../../../../../src/app/models/user.models';
import { Database } from '../../../../../src/main/database/database.connection';
import { CacheDatabase } from '../../../../../src/main/database/redis.connection';

describe('Testes unitários do create user usecase', () => {
    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();

        jest.spyOn(UserRepository.prototype, 'getByEmail').mockResolvedValue(
            user
        );
        jest.spyOn(UserRepository.prototype, 'create').mockResolvedValue();
    });

    const user = new User('any_name', 'any_email', 'any_password');

    function createSut() {
        const userRepository = new UserRepository();
        return new CreateUserUsecase(userRepository);
    }

    test('deveria retornar email já registrado caso o email já tinha sido cadastrado', async () => {
        const sut = createSut();

        const result = await sut.execute({
            name: user.name,
            email: user.email,
            password: user.password,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(400);
        expect(result.ok).toBe(false);
        expect(result.message).toEqual('Email already registered');
    });

    test('deveria retornar sucesso se o usuário for cadastrado corretamente', async () => {
        const sut = createSut();
        const user = new User('any_name', 'any_email', 'any_password');

        jest.spyOn(UserRepository.prototype, 'getByEmail').mockResolvedValue(
            undefined
        );

        const result = await sut.execute({
            name: user.name,
            email: user.email,
            password: user.password,
        });

        expect(result).toBeDefined();
        expect(result.code).toBe(201);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual('User created successfully');

        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('name', user.name);
        expect(result.data).toHaveProperty('email', user.email);
        expect(result.data).not.toHaveProperty('password');
    });
});
