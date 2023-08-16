import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserUsecase } from '../usecases/create-user.usecase';
import { GetUserUsecase } from '../usecases/get-user.usecase';
import { ListUserUsecase } from '../usecases/list-user.usecase';
import { LoginUsecase } from '../usecases/login-user.usecase';

export function createUserController() {
    const userRepoSigleton = new UserRepository();

    const createUsecase = new CreateUserUsecase(userRepoSigleton);
    const listUsecase = new ListUserUsecase(userRepoSigleton);
    const getUsecase = new GetUserUsecase(userRepoSigleton);
    const loginUsecase = new LoginUsecase(userRepoSigleton);

    return new UserController(
        createUsecase,
        listUsecase,
        getUsecase,
        loginUsecase
    );
}
